export type PlanetId = "home" | "services" | "process" | "about" | "faq" | "contact";

export type PlanetDef = {
  id: PlanetId;
  label: string;
  // Direction from the sun (origin) each panel/camera vantage sits along.
  // Not normalized to length 1 — relative magnitudes just bias height/spread.
  direction: [number, number, number];
  // Extra vertical nudge applied only to the panel's own screen position
  // (not the camera), for one-off framing tweaks per section.
  panelLift?: number;
};

export const PLANETS: PlanetDef[] = [
  { id: "home", label: "Home", direction: [0, 0.15, 1], panelLift: 0.5 },
  { id: "services", label: "Services", direction: [0.85, 0.25, 0.5], panelLift: 0.5 },
  { id: "process", label: "Process", direction: [-0.9, -0.05, 0.4], panelLift: 0.5 },
  { id: "about", label: "About", direction: [0, 0.4, -1] },
  { id: "faq", label: "FAQ", direction: [-0.8, 0.2, -0.55], panelLift: 0.5 },
  { id: "contact", label: "Contact", direction: [0.85, -0.1, -0.5], panelLift: 0.5 },
];

const PANEL_RADIUS = 3.2;
const CAMERA_RADIUS = 8;
const CAMERA_LIFT = 1.4;

// Panels sit close in around the sun; the camera sits further out along the
// exact same direction and always looks back at the origin, so the sun stays
// in frame at every stop and switching stages is a short pivot around it
// rather than a long flight across open space.
export function getPanelPosition(planet: PlanetDef): [number, number, number] {
  const [dx, dy, dz] = planet.direction;
  return [dx * PANEL_RADIUS, dy * PANEL_RADIUS * 0.6 + (planet.panelLift ?? 0), dz * PANEL_RADIUS];
}

export function getCameraPosition(planet: PlanetDef): [number, number, number] {
  const [dx, dy, dz] = planet.direction;
  return [dx * CAMERA_RADIUS, dy * CAMERA_RADIUS * 0.4 + CAMERA_LIFT, dz * CAMERA_RADIUS];
}
