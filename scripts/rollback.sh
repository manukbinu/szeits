#!/usr/bin/env bash
# =============================================================================
# rollback.sh
# Runs ON THE TARGET SERVER (invoked over SSH by the GitHub Actions workflow,
# or manually by an operator: `sudo ./rollback.sh /var/www/myapp`).
#
# Points the 'current' symlink back at the previous release directory and
# reloads Nginx. Safe to run even if a deploy partially completed.
# =============================================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[rollback]${NC} $*"; }
warn() { echo -e "${YELLOW}[rollback][warn]${NC} $*"; }
err()  { echo -e "${RED}[rollback][error]${NC} $*" >&2; }

SERVER_PATH="${1:?SERVER_PATH argument required}"
SITE_DOMAIN="${2:?SITE_DOMAIN argument required}"
RELEASES_DIR="${SERVER_PATH}/releases"
CURRENT_LINK="${SERVER_PATH}/current"

log "Starting rollback for ${SERVER_PATH}"

if [ ! -d "${RELEASES_DIR}" ]; then
  err "Releases directory ${RELEASES_DIR} does not exist. Nothing to roll back to."
  exit 1
fi

CURRENT_TARGET=""
if [ -L "${CURRENT_LINK}" ]; then
  CURRENT_TARGET="$(readlink -f "${CURRENT_LINK}")"
fi

# Find the most recent release that is NOT the currently-live (broken) one.
PREVIOUS_RELEASE="$(
  cd "${RELEASES_DIR}" && ls -1dt */ 2>/dev/null \
    | sed 's#/$##' \
    | while read -r dir; do
        full_path="${RELEASES_DIR}/${dir}"
        if [ "${full_path}" != "${CURRENT_TARGET}" ]; then
          echo "${full_path}"
          break
        fi
      done
)"

if [ -z "${PREVIOUS_RELEASE}" ]; then
  err "No previous release found to roll back to."
  exit 1
fi

if [ ! -f "${PREVIOUS_RELEASE}/index.html" ]; then
  err "Candidate rollback release ${PREVIOUS_RELEASE} looks invalid (no index.html)."
  exit 1
fi

log "Rolling back to: ${PREVIOUS_RELEASE}"
ln -sfn "${PREVIOUS_RELEASE}" "${CURRENT_LINK}.tmp"
mv -Tf "${CURRENT_LINK}.tmp" "${CURRENT_LINK}"

log "Testing Nginx configuration"
if ! nginx -t; then
  err "Nginx config test failed even after rollback. Manual intervention required."
  exit 1
fi

log "Reloading Nginx"
systemctl reload nginx

sleep 1
HTTP_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --resolve "${SITE_DOMAIN}:443:127.0.0.1" "https://${SITE_DOMAIN}/" 2>/dev/null || echo "000")"
if [ "${HTTP_CODE}" != "200" ]; then
  err "Site still unhealthy after rollback (HTTP ${HTTP_CODE}). Manual intervention required."
  exit 1
fi

log "Rollback completed successfully. Live release: ${PREVIOUS_RELEASE}"
exit 0
