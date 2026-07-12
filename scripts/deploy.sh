#!/usr/bin/env bash
# =============================================================================
# deploy.sh
# Runs ON THE TARGET SERVER (invoked over SSH by the GitHub Actions workflow).
#
# Usage:
#   deploy.sh <SERVER_PATH> <TARBALL_PATH> <COMMIT_SHA> <RELEASES_TO_KEEP>
#
# Layout this script maintains on the server:
#
#   <SERVER_PATH>/
#     current -> releases/<timestamp>_<sha>      (symlink, atomically swapped)
#     releases/
#       2026-07-10_153000_ab12cd3/
#       2026-07-09_120000_9f8e7d6/               (older releases kept as backups)
#     .deploy.lock
#
# Nginx's root should point at <SERVER_PATH>/current, NOT at a release folder
# directly. That's what makes the symlink swap a safe, near-atomic cutover.
# =============================================================================
set -euo pipefail

# --- Colored logging helpers ------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[deploy][warn]${NC} $*"; }
err()  { echo -e "${RED}[deploy][error]${NC} $*" >&2; }

# --- Arguments ---------------------------------------------------------------
SERVER_PATH="${1:?SERVER_PATH argument required}"
TARBALL_PATH="${2:?TARBALL_PATH argument required}"
COMMIT_SHA="${3:?COMMIT_SHA argument required}"
RELEASES_TO_KEEP="${4:-5}"
SITE_DOMAIN="${5:?SITE_DOMAIN argument required}"

# Health checks below use --resolve to pin SITE_DOMAIN to 127.0.0.1 for both
# TLS SNI and the Host header, matching name-based vhosts (server_name) in
# Nginx. A bare `curl http://localhost/` would send Host: localhost, which
# doesn't match a server_name block and can return a misleading 404.

RELEASES_DIR="${SERVER_PATH}/releases"
CURRENT_LINK="${SERVER_PATH}/current"
LOCK_FILE="${SERVER_PATH}/.deploy.lock"
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
SHORT_SHA="${COMMIT_SHA:0:7}"
RELEASE_NAME="${TIMESTAMP}_${SHORT_SHA}"
RELEASE_DIR="${RELEASES_DIR}/${RELEASE_NAME}"
WEB_USER="www-data"
WEB_GROUP="www-data"

PREVIOUS_RELEASE=""

# --- Basic locking so two deploys can never overlap on this box -------------
if [ -e "${LOCK_FILE}" ]; then
  err "Another deployment appears to be in progress (${LOCK_FILE} exists). Aborting."
  exit 1
fi
trap 'rm -f "${LOCK_FILE}"' EXIT
touch "${LOCK_FILE}"

log "Starting deployment ${RELEASE_NAME}"

# --- Ensure directory structure exists ---------------------------------------
mkdir -p "${RELEASES_DIR}"

# --- Record the current release so we can roll back / prune later ----------
if [ -L "${CURRENT_LINK}" ]; then
  PREVIOUS_RELEASE="$(readlink -f "${CURRENT_LINK}")"
  log "Current live release: ${PREVIOUS_RELEASE}"
else
  warn "No existing 'current' symlink found (this looks like the first deploy)."
fi

# --- Extract new release -----------------------------------------------------
log "Extracting new release into ${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}"
if ! tar -xzf "${TARBALL_PATH}" -C "${RELEASE_DIR}"; then
  err "Failed to extract release tarball."
  rm -rf "${RELEASE_DIR}"
  exit 1
fi

# --- Sanity-check the new release before going live --------------------------
if [ ! -f "${RELEASE_DIR}/index.html" ]; then
  err "index.html not found in new release. Refusing to deploy a broken build."
  rm -rf "${RELEASE_DIR}"
  exit 1
fi

# --- Correct ownership & permissions -----------------------------------------
log "Setting file permissions"
chown -R "${WEB_USER}:${WEB_GROUP}" "${RELEASE_DIR}"
find "${RELEASE_DIR}" -type d -exec chmod 755 {} \;
find "${RELEASE_DIR}" -type f -exec chmod 644 {} \;

# --- Atomically swap the symlink to point at the new release ----------------
log "Switching 'current' symlink to new release"
ln -sfn "${RELEASE_DIR}" "${CURRENT_LINK}.tmp"
mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"

# --- Validate & reload Nginx -------------------------------------------------
log "Testing Nginx configuration"
if ! nginx -t; then
  err "Nginx configuration test failed after symlink swap. Rolling back."
  if [ -n "${PREVIOUS_RELEASE}" ]; then
    ln -sfn "${PREVIOUS_RELEASE}" "${CURRENT_LINK}"
  fi
  exit 1
fi

log "Reloading Nginx"
systemctl reload nginx

# --- Local smoke test before declaring success -------------------------------
sleep 1
HTTP_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --resolve "${SITE_DOMAIN}:443:127.0.0.1" "https://${SITE_DOMAIN}/" 2>/dev/null || echo "000")"
if [ "${HTTP_CODE}" != "200" ]; then
  err "Post-deploy health check failed (HTTP ${HTTP_CODE}). Rolling back."
  if [ -n "${PREVIOUS_RELEASE}" ]; then
    ln -sfn "${PREVIOUS_RELEASE}" "${CURRENT_LINK}"
    systemctl reload nginx
  fi
  exit 1
fi

log "Health check passed (HTTP ${HTTP_CODE})"

# --- Prune old releases, keeping only the N most recent ----------------------
log "Pruning old releases (keeping last ${RELEASES_TO_KEEP})"
cd "${RELEASES_DIR}"
ls -1dt */ 2>/dev/null | tail -n "+$((RELEASES_TO_KEEP + 1))" | xargs -r rm -rf --

log "Deployment ${RELEASE_NAME} completed successfully."
exit 0
