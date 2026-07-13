"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { animate, createTimeline, createTimer, stagger, utils, cubicBezier } from "animejs";
import { getInstances } from "animejs/adapters/three";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useDeviceCapability } from "@/lib/useDeviceCapability";

type Palette = {
  bg: string;
  sceneGrey: string;
  horizonGrey: string;
  skyGrey: string;
  accent: string;
};

const PALETTES: { dark: Palette; light: Palette } = {
  dark: {
    bg: "#070c0b",
    sceneGrey: "#16332c",
    horizonGrey: "#0d1e19",
    skyGrey: "#0a1512",
    accent: "#2dd4bf",
  },
  light: {
    bg: "#faf9fc",
    sceneGrey: "#d9ece5",
    horizonGrey: "#eef4f1",
    skyGrey: "#c9e4da",
    accent: "#0d9488",
  },
};

function readTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function SzeitsLogoIntro({ onDone }: { onDone: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const tier = useDeviceCapability();
  // Perf tier is only used to size a few initial assets (floor grid,
  // pixel ratio) — snapshotted at mount via this ref rather than kept as a
  // reactive effect dependency, so a tier change from resizing across the
  // hook's own width breakpoint doesn't tear down and replay the whole
  // (now persistent) scene.
  const tierRef = useRef(tier);
  useEffect(() => {
    tierRef.current = tier;
  }, [tier]);
  const doneRef = useRef(false);
  // Once the intro timeline finishes, the model stays on screen as a fixed
  // background (see the JSX below) instead of the whole thing unmounting.
  const [revealed, setRevealed] = useState(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setRevealed(true);
    onDone();
  };

  useEffect(() => {
    // Reduced motion: skip the spectacle entirely, no WebGL context spun up.
    if (reducedMotion) {
      const t = setTimeout(finish, 200);
      return () => clearTimeout(t);
    }

    const mount = mountRef.current;
    if (!mount) return;
    const tier = tierRef.current;
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let onResize: (() => void) | null = null;
    let themeObserver: MutationObserver | null = null;
    let stopTimer: { pause: () => void } | null = null;

    (async () => {
      let theme = readTheme();
      const palette = () => PALETTES[theme];

      const wrapper = new THREE.Group();
      wrapper.position.y = 0;

      // The real SZEITS 3D model, revealed right after the floor-explode
      // build-up (see "glb reveal"). Hidden (scale 0) until then.
      const glbGroup = new THREE.Group();
      let glbRadius = 1;
      let glbTargetScale = 1;
      wrapper.add(glbGroup);
      glbGroup.scale.setScalar(0);

      // Reference camera distance/fov (the pose set below, before any
      // flatten/zoom animation) used to size the model against the actual
      // visible frustum at reveal time, so it fits consistently whether the
      // site loads on mobile, tablet, or a wide laptop screen.
      const REF_CAMERA_DIST = 20.66;
      const REF_FOV_DEG = 60;
      // Fraction of the visible frustum height/width the model may occupy —
      // kept comfortably under 1 so there's always margin above and below.
      const GLB_FIT_MARGIN = 0.72;

      const computeGlbTargetScale = (modelDiameter: number) => {
        const aspect = mount.clientWidth / mount.clientHeight;
        const fovRad = (REF_FOV_DEG * Math.PI) / 180;
        // camera.zoom narrows the effective FOV (zoom > 1 = more magnified,
        // less visible area) — by the moment the reveal actually plays, the
        // "camera zoom in" tween has already pushed zoom to ~2, so the real
        // visible frustum is much smaller than the zoom=1 reference alone
        // would suggest. Read the live value here (this is only ever
        // invoked once camera exists) rather than assuming zoom=1.
        const visibleHeight = (2 * Math.tan(fovRad / 2) * REF_CAMERA_DIST) / camera.zoom;
        const visibleWidth = visibleHeight * aspect;
        const targetDiameter = Math.min(visibleHeight, visibleWidth) * GLB_FIT_MARGIN;
        // modelDiameter is already the model's full largest-dimension extent
        // (see Box3.getSize below), not a radius — dividing by it directly
        // (not 2x it) gives the correct fit-to-screen scale factor.
        return targetDiameter / modelDiameter;
      };

      new GLTFLoader().load(
        "/models/hitem3d-model.glb",
        (gltf) => {
          if (cancelled) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          glbRadius = Math.max(size.x, size.y, size.z) || 1;
          glbTargetScale = computeGlbTargetScale(glbRadius);
          model.position.sub(center);
          glbGroup.add(model);
          // If the reveal animation already ran before the (async) model
          // finished loading, snap straight to the correct final scale
          // instead of staying invisible at scale 0.
          if (glbGroup.scale.x > 0.001) glbGroup.scale.setScalar(glbTargetScale);
        },
        undefined,
        () => {
          /* Model failed to load: the intro still completes normally via
             the timeline's onComplete, it just has nothing to reveal. */
        }
      );

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(palette().bg);

      const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(palette().skyGrey) },
          bottomColor: { value: new THREE.Color(palette().horizonGrey) },
          offset: { value: 32 },
          exponent: { value: 0.6 },
        },
        side: THREE.BackSide,
        fog: false,
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0);
            #include <colorspace_fragment>
          }
        `,
      });
      const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 15), skyMaterial);
      scene.add(sky);
      scene.add(wrapper);

      const FLOOR_SIZE = tier === "high" ? 31 : tier === "medium" ? 23 : 15;
      const floorTileSize = 1;
      const floorGroup = new THREE.Group();
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette().sceneGrey),
        roughness: 0.7,
        metalness: 0.05,
      });
      const floor = new THREE.InstancedMesh(
        new THREE.BoxGeometry(floorTileSize, floorTileSize, floorTileSize),
        floorMaterial,
        FLOOR_SIZE * FLOOR_SIZE
      );
      const dummy = new THREE.Object3D();
      for (let r = 0; r < FLOOR_SIZE; r++) {
        for (let c = 0; c < FLOOR_SIZE; c++) {
          dummy.position.set(c - (FLOOR_SIZE - 1) / 2, 0, r - (FLOOR_SIZE - 1) / 2);
          dummy.updateMatrix();
          floor.setMatrixAt(r * FLOOR_SIZE + c, dummy.matrix);
        }
      }
      floorGroup.add(floor);
      const tiles = getInstances(floor);

      const FLOOR_HALF = (FLOOR_SIZE * floorTileSize) / 2;
      const SKIRT_EXT = 5;
      const skirts: THREE.Mesh[] = [];
      const addSkirt = (width: number, depth: number, x: number, z: number) => {
        const skirt = new THREE.Mesh(new THREE.BoxGeometry(width, floorTileSize, depth), floorMaterial);
        skirt.position.set(x, 0, z);
        floorGroup.add(skirt);
        skirts.push(skirt);
      };
      addSkirt(SKIRT_EXT, 2 * FLOOR_HALF, FLOOR_HALF + SKIRT_EXT / 2, 0);
      addSkirt(SKIRT_EXT, 2 * FLOOR_HALF, -FLOOR_HALF - SKIRT_EXT / 2, 0);
      addSkirt(2 * FLOOR_HALF + 2 * SKIRT_EXT, SKIRT_EXT, 0, FLOOR_HALF + SKIRT_EXT / 2);
      addSkirt(2 * FLOOR_HALF + 2 * SKIRT_EXT, SKIRT_EXT, 0, -FLOOR_HALF - SKIRT_EXT / 2);
      scene.add(floorGroup);

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(floorTileSize, floorTileSize, floorTileSize),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(palette().accent), roughness: 0.4, metalness: 0.1 })
      );
      scene.add(cube);

      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
      keyLight.position.set(100, 200, 300);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0x5eead4, 0.6);
      rimLight.position.set(-200, -50, 150);
      scene.add(rimLight);

      const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.01, 100);
      const cameraRig = new THREE.Group();
      cameraRig.add(camera);
      scene.add(cameraRig);

      // alpha:true so once the intro finishes and the sky/floor are hidden,
      // empty frame areas are truly transparent — that's what lets the
      // page's scrolling content show through around the persisted model.
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === "high" ? 2 : 1.5));
      renderer.domElement.style.opacity = "0";
      mount.appendChild(renderer.domElement);

      onResize = () => {
        if (!renderer) return;
        const aspect = mount.clientWidth / mount.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        // Re-fit the model to the new viewport (e.g. orientation change on
        // mobile/tablet) — snap immediately if it's already revealed.
        glbTargetScale = computeGlbTargetScale(glbRadius);
        if (glbGroup.scale.x > 0.001) glbGroup.scale.setScalar(glbTargetScale);
      };
      window.addEventListener("resize", onResize);

      // Live theme reactivity: swap material/uniform colors in place,
      // no restart, mirroring how ThemeToggle.tsx flips the `dark` class.
      const applyTheme = () => {
        const p = palette();
        scene.background = new THREE.Color(p.bg);
        skyMaterial.uniforms.topColor.value.set(p.skyGrey);
        skyMaterial.uniforms.bottomColor.value.set(p.horizonGrey);
        floorMaterial.color.set(p.sceneGrey);
        (cube.material as THREE.MeshStandardMaterial).color.set(p.accent);
      };
      themeObserver = new MutationObserver(() => {
        const next = readTheme();
        if (next !== theme) {
          theme = next;
          applyTheme();
        }
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      // Camera pose + render loop
      utils.set(camera, { x: 0, y: 5.64, z: 20.66, rotateX: -14.73, fov: 60, zoom: 1, near: 1, far: 2000 });
      const DEG2RAD = Math.PI / 180;
      const FLATTEN_BASE_FOV = camera.fov;
      const FLATTEN_DIST_NUM = camera.position.z * Math.tan((FLATTEN_BASE_FOV * 0.5 * DEG2RAD));
      const flattenDezoom = { value: 1 };

      const glbWorldPos = new THREE.Vector3();
      stopTimer = createTimer({
        priority: 0,
        onUpdate: () => {
          camera.position.z = (FLATTEN_DIST_NUM * flattenDezoom.value) / Math.tan(camera.fov * 0.5 * DEG2RAD);
          if (glbGroup.scale.x > 0.01) {
            // Slow idle spin once the GLB model is revealed, and keep the
            // camera centered on it — without this the camera's pose (tuned
            // for the earlier floor/cube choreography) leaves the model
            // sitting low/off-center in frame instead of filling the view.
            glbGroup.rotation.y += 0.006;
            glbGroup.getWorldPosition(glbWorldPos);
            camera.lookAt(glbWorldPos);
          }
          renderer!.render(scene, camera);
        },
      });

      utils.set(ambient, { intensity: 0.6 });
      utils.set(keyLight, { intensity: 1.6, x: 0, y: 30, z: 0 });
      utils.set(rimLight, { intensity: 0.6, x: -200, y: -50, z: 150 });
      utils.set(tiles, {
        x: stagger(1, { grid: true, from: "center", axis: "x" }),
        z: stagger(1, { grid: true, from: "center", axis: "z" }),
        y: 0,
      });
      utils.set(cube, { x: 0, y: 0, z: 0, transformOriginY: -0.5 });

      const centerTile = tiles[Math.floor(FLOOR_SIZE / 2) * FLOOR_SIZE + Math.floor(FLOOR_SIZE / 2)]!;
      const EXPLODE_RADIUS = Math.min(10, Math.floor(FLOOR_SIZE / 2) - 1);

      const mulberry32 = (seed: number) => {
        let state = seed | 0;
        return () => {
          state = (state + 0x6d2b79f5) | 0;
          let t = Math.imul(state ^ (state >>> 15), 1 | state);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      };
      const seeded = (seed: number, min: number, max: number) => {
        const rand = mulberry32(seed);
        return () => min + rand() * (max - min);
      };
      const explodeDurX = seeded(4, 800, 1279);
      const explodeDurZ = seeded(0, 800, 1279);
      const explodeDurY = seeded(7, 800, 1279);
      const explodeRotX = seeded(7, -1080, 1080);
      const explodeRotY = seeded(13, -1080, 1080);
      const explodeRotZ = seeded(21, -1080, 1080);
      const explodeScaleDur = seeded(0, 500, 1200);

      const shake =
        (amp: number, cycles: number, opts: { decay?: number; sweep?: number; settle?: number; dir?: number; center?: number } = {}) =>
        (t: number) => {
          const { decay = 1, sweep = 0, settle = 0, dir = 1, center = 0 } = opts;
          return center + dir * (settle + (amp - settle) * (1 - t) ** decay) * Math.sin(cycles * (t + sweep * t * t) * 2 * Math.PI);
        };
      const lateShake = (amp: number, cycles: number, start: number, opts = {}) => {
        const inner = shake(amp, cycles, opts);
        return (t: number) => (t < start ? 0 : inner((t - start) / (1 - start)));
      };

      const tl = createTimeline({ id: "szeits-logo-intro", autoplay: false })
        .add(
          renderer.domElement,
          { id: "fade in", opacity: [0, 1], duration: 1300, ease: "inOut(2)" },
          0
        )
        .add(
          camera,
          {
            id: "camera follow",
            rotateX: [
              { to: 38, duration: 700, ease: "inOut(2)" },
              { to: 41, duration: 500, delay: 0, ease: "inOutSine" },
              { to: 40.5, duration: 200, delay: 0, ease: "inOutSine" },
              { to: 36, duration: 180, delay: 0, ease: "in(2)" },
              { to: 24, duration: 80, delay: 0, ease: "in(2)" },
              { to: -10, duration: 40, delay: 0, ease: "in(1.5)" },
              { to: -16.5, duration: 90, delay: 20, ease: "out(2)" },
              { to: -14.73, duration: 190, delay: 0, ease: "inOutSine" },
            ],
            y: [
              { to: 6.3, duration: 900, ease: "inOut(2)" },
              { to: 6.4, duration: 500, delay: 0, ease: "inOutSine" },
              { to: 6.15, duration: 180, delay: 0, ease: "in(2)" },
              { to: 5.04, duration: 120, delay: 0, ease: "in(2)" },
            ],
          },
          300
        )
        .add(
          cube,
          {
            id: "cube enter",
            y: [
              { from: 24, to: 1, duration: 300, delay: 1700, ease: "in(5.0825)" },
              { from: 0, to: 0.138, duration: 60, delay: 0, ease: cubicBezier(0, 1.1575, 0.5712, 0.9605) },
              { to: -0.75, duration: 1040, ease: cubicBezier(0, 1.1575, 0.5712, 0.9605) },
              { from: -1.75, to: -2.5, duration: 146, delay: 0, ease: "out(9.8523)" },
            ],
            scaleX: [
              { from: 0, to: 1, duration: 2000, delay: 0 },
              { from: 1.3, to: 1, duration: 100, ease: "out(2)" },
            ],
            scaleY: [
              { from: 5, to: 2, duration: 2000, delay: 0 },
              { to: 1.25, duration: 200, delay: 0, ease: cubicBezier(0.1, 0.7, 0.5763, 0.7728) },
              { to: 1, duration: 900, delay: 0, ease: cubicBezier(0.1, 0.7, 0.5763, 0.7728) },
            ],
            scaleZ: [
              { from: 0, to: 1, duration: 2000 },
              { from: 1.3, to: 1, duration: 100, ease: "out(2)" },
            ],
            ease: "in(2.4146)",
            skewX: { from: 0, to: 1, duration: 1143, delay: 2000, ease: "linear", modifier: shake(8, 18, { decay: 2 }) },
            skewZ: { from: 0, to: 1, duration: 1143, delay: 2000, ease: "linear", modifier: shake(8, 18, { decay: 2 }) },
          },
          0
        )
        .set(centerTile, { scale: 0 }, 2000)
        .add(
          tiles,
          {
            id: "floor crash",
            y: [
              {
                from: 0,
                to: stagger([0.15, 0], { from: "center", ease: "linear(0, 0.185 70.69%, 0.4644 84.63%, 0.7852 95.62%, 1)", grid: true }),
                duration: 50,
                delay: stagger([0, 451], { from: "center", ease: "in(2.5507)", grid: true }),
                ease: cubicBezier(0.5621, 0.9568, 0.5, 1),
              },
              {
                to: stagger([-1.5, 0], { from: "center", ease: "linear(0, 0.2812 12.72%, 0.5478 20.84%, 1 41.29%, 1)", grid: true, jitter: [0.102, 0], seed: 0 }),
                duration: 1050,
                delay: 0,
                ease: cubicBezier(0, 0.8, 0, 1.0128),
              },
              {
                to: stagger([-3, 0], { from: "center", ease: "linear(0, 0 14.17%, 0.5317 25.26%, 0.8904 47.35%, 1 47.8%, 1)", grid: true, jitter: [0.3, 0], seed: 0 }),
                duration: stagger([0, 656], { from: "center", ease: "linear(0, 0.0368 14.54%, 0.3042 62.23%, 1 62.24%, 1)", grid: true, jitter: [50, 0], seed: 0 }),
                delay: 0,
                ease: cubicBezier(0, 1.0807, 0.3512, 1.2537),
              },
            ],
            rotateX: { to: stagger([0, 0], { from: "center", ease: "linear(0, 0 13.93%, 0.2419 40.77%, 1 55.03%, 1)", grid: true, jitter: [20, 0], seed: 6 }), duration: 1200, delay: 0 },
            rotateY: { to: stagger([0, 0], { from: "center", ease: "linear(0, 0 13.93%, 0.2419 40.77%, 1 55.03%, 1)", grid: true, jitter: [20, 0], seed: 12 }), duration: 1260, delay: 0 },
            rotateZ: { to: stagger([0, 0], { from: "center", ease: "linear(0, 0 13.93%, 0.2419 40.77%, 1 55.03%, 1)", grid: true, jitter: [20, 0], seed: 3 }), duration: 1200, delay: 50 },
          },
          2000
        )
        .add(
          camera,
          {
            id: "camera shake",
            y: { from: 0, to: 1, duration: 1412, ease: "linear", modifier: (t: number) => shake(0.12, 15, { decay: 2, center: 5.64 })(t) + lateShake(0.97, 2, 0.78, { decay: 1.6 })(t) },
            rotateZ: { from: 0, to: 1, duration: 1437, ease: "linear", modifier: (t: number) => shake(0.42, 10, { decay: 1.8 })(t) + lateShake(0.42, 2, 0.79, { decay: 1.4 })(t) },
            ease: "inOutSine",
          },
          2000
        )
        .add(
          cube,
          {
            id: "cube recover",
            skewX: [
              { to: -9, duration: 58, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: 7, duration: 63, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: -5, duration: 71, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: 3.5, duration: 77, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: -2, duration: 82, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: 1, duration: 90, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: -0.5, duration: 96, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
              { to: 0, duration: 83, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            ],
            scaleY: [
              { to: 0.8, duration: 77, ease: "out(3)" },
              { to: 1.12, duration: 102, delay: 0, ease: "inOutSine" },
              { to: 0.94, duration: 109, delay: 0, ease: "inOutSine" },
              { to: 1.05, duration: 115, delay: 0, ease: "inOutSine" },
              { to: 0.98, duration: 109, delay: 0, ease: "inOutSine" },
              { to: 0.97, duration: 108, delay: 0, ease: "inOutSine" },
            ],
            scaleX: [
              { to: 1.15, duration: 77, ease: "out(3)" },
              { to: 0.93, duration: 102, delay: 0, ease: "inOutSine" },
              { to: 1.04, duration: 109, delay: 0, ease: "inOutSine" },
              { to: 0.97, duration: 115, delay: 0, ease: "inOutSine" },
              { to: 1.01, duration: 109, delay: 0, ease: "inOutSine" },
              { to: 1.02, duration: 108, delay: 0, ease: "inOutSine" },
            ],
            scaleZ: [
              { to: 1.15, duration: 77, ease: "out(3)" },
              { to: 0.93, duration: 102, delay: 0, ease: "inOutSine" },
              { to: 1.04, duration: 109, delay: 0, ease: "inOutSine" },
              { to: 0.97, duration: 115, delay: 0, ease: "inOutSine" },
              { to: 1.01, duration: 109, delay: 0, ease: "inOutSine" },
              { to: 1.02, duration: 108, delay: 0, ease: "inOutSine" },
            ],
            y: [
              { to: -2.56, duration: 77, ease: "out(3)" },
              { to: -2.47, duration: 128, delay: 0, ease: "inOutSine" },
              { to: -2.52, duration: 140, delay: 0, ease: "inOutSine" },
              { to: -2.53, duration: 275, delay: 0, ease: "inOutSine" },
            ],
          },
          3230
        )
        .add(
          cube,
          {
            id: "cube expand",
            scaleY: { to: 4, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
            scaleX: { to: 0.8, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
            scaleZ: { to: 0.8, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
            y: { to: 0.75, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
            skewX: { from: 0, to: 1, duration: 4150, delay: 800, ease: "linear", modifier: shake(9.5, 21, { decay: 1.5, sweep: 1.2, settle: 3.1 }) },
            skewZ: { from: 0, to: 1, duration: 4150, delay: 800, ease: "linear", modifier: shake(4.3, 18, { decay: 0.7, sweep: 1.4, dir: -1 }) },
          },
          3050
        )
        .add(
          getCenterTiles(tiles, FLOOR_SIZE, 8),
          {
            id: "floor expand",
            y: [
              { to: stagger([-3.5, -0.82], { from: "center", ease: "linear(0, 0.0878 0.01%, 0.3904 50.14%, 0.7766 68.95%, 1)", grid: true, jitter: [0.3, 0], seed: 0 }), duration: 260, delay: 0, ease: "out(3)" },
              { to: stagger([1.4, -0.72], { from: "center", ease: "linear(0, 0 28.61%, 0.27 28.62%, 0.7766 68.95%, 1)", grid: true, jitter: [0.3, 0], seed: 0 }), duration: 4100, delay: 440, ease: cubicBezier(0.2423, -0.0053, 0.367, 0.5896) },
            ],
          },
          3200
        )
        .label("POP", 8000)
        .label("slowmo start", "POP-=0")
        .label("slowmo end", "POP+=500")
        .add(camera, { id: "camera zoom in", zoom: { to: 2, duration: 5500, delay: 0, ease: cubicBezier(0.6985, 0.1061, 0.5527, 0.7364) } }, 2500)
        .add(
          cameraRig,
          {
            id: "camera orbit",
            rotateY: [
              { from: -270, to: -180, duration: 3600, delay: 0 },
              { to: 0, duration: 700, delay: 1000, ease: cubicBezier(0.375, -0.0148, 0, 1.0101) },
            ],
            rotateX: { to: 0, duration: 1900, delay: 2700 },
            y: [
              { to: 0, duration: 1900, delay: 2700 },
              { to: 0, duration: 300, delay: 0, ease: "out(2)" },
            ],
            ease: "inOut(2)",
          },
          3400
        )
        .add(
          getCenterTiles(tiles, FLOOR_SIZE, EXPLODE_RADIUS),
          {
            id: "floor explode",
            x: { to: stagger([1, 40], { from: "center", grid: true, axis: "x", jitter: 5, seed: 0 }), duration: () => explodeDurX(), delay: stagger([0, 137], { from: "center", grid: true }), ease: "out(5.3605)" },
            z: { to: stagger([1, 40], { from: "center", grid: true, axis: "z" }), duration: () => explodeDurZ(), delay: stagger([0, 137], { from: "center", grid: true, jitter: 5, seed: 0 }), ease: "out(5.3605)" },
            y: { to: stagger([40, 1], { from: "center", ease: cubicBezier(0.3326, 0.0289, 0.9886, 0.4057), grid: true, jitter: 5, seed: 0 }), duration: () => explodeDurY(), delay: stagger([0, 137], { from: "center", grid: true }), ease: "out(5.3605)" },
            rotateX: { to: () => explodeRotX(), duration: 815, delay: stagger([0, 314], { from: "center", grid: true }), ease: "out(2)" },
            rotateY: { to: () => explodeRotY(), duration: 815, delay: stagger([0, 314], { from: "center", grid: true }), ease: "out(2)" },
            rotateZ: { to: () => explodeRotZ(), duration: 815, delay: stagger([0, 314], { from: "center", grid: true }), ease: "out(2)" },
            scale: { to: 0, duration: () => explodeScaleDur(), delay: stagger([0, 314], { from: "center", grid: true }), ease: "out(2.8731)" },
            duration: 113,
            delay: stagger([0, 210], { from: "center", grid: true, seed: 0 }),
            ease: "linear",
          },
          "POP-=15"
        )
        .add(
          [...getOuterTiles(tiles, FLOOR_SIZE, EXPLODE_RADIUS), ...skirts],
          { id: "floor drop", y: { to: -50, duration: 604, delay: 146, ease: cubicBezier(0.8109, 0.0308, 0.9152, 0.5479) } },
          "POP-=150"
        )
        // The floor-explode build-up IS the "initial animation" — the SZEITS
        // 3D model reveals immediately here, in place of any wordmark.
        .add(
          cube,
          { id: "cube out", scale: { to: 0, duration: 260, ease: "in(2)" } },
          "POP"
        )
        .add(
          glbGroup,
          {
            id: "glb reveal",
            // Recompute live rather than reading the value cached at model
            // load time: by the time this actually plays (right at "POP"),
            // the "camera zoom in" tween has already finished, so the real
            // fit-to-screen size depends on the zoom level at THIS moment,
            // not whatever zoom was active when the model first loaded.
            scale: { from: 0, to: () => computeGlbTargetScale(glbRadius), duration: 750, ease: "outElastic(1.15, 0.8)" },
            rotateY: { from: -70, to: 0, duration: 900, ease: "out(2.5)" },
          },
          "POP"
        )
        .add(
          camera,
          {
            id: "camera pop",
            y: { to: 7, duration: 1100, ease: "out(4.9225)" },
            rotateX: [
              { to: 9.1, duration: 260, ease: "out(3.2713)" },
              { to: 0, duration: 700, ease: "out(3)", delay: 140 },
            ],
            zoom: { to: 1, duration: 400, ease: "out(3)" },
          },
          "POP"
        )
        .add(camera, { id: "camera flatten", fov: { to: 8, duration: 900, ease: "out(2)" } }, "POP+=1050")
        .add(flattenDezoom, { id: "camera dezoom", value: { to: 1.4, duration: 1150, delay: 0 }, duration: 1150, ease: "out(2)" }, "POP+=1050")
        .add(
          skyMaterial,
          { id: "sky to bg", topColor: palette().bg, bottomColor: palette().bg, duration: 465, ease: "inOut(4.348)" },
          "POP+=1500"
        )
        .add(
          ambient,
          { id: "ambient up", intensity: [{ to: 3, duration: 300 }, { to: 1, duration: 700, delay: 700 }], duration: 240, ease: "inOut(1.8042)" },
          "POP+=1650"
        )
        .init();

      // Playback speed: the timeline's own internal labels/keyframes (in
      // virtual ms) are left untouched — instead the OUTER scrub below
      // controls how much real wall-clock time it takes to play through
      // that virtual timeline. The first and last segments normally scrub
      // 1:1 (real ms == virtual ms); scaling their real durations down by
      // INTRO_SPEED makes the whole intro play back faster uniformly
      // without re-tuning any individual animation.
      const INTRO_SPEED = 0.38;
      const player = animate(tl, {
        id: "szeits-intro-player",
        currentTime: [
          { to: () => tl.labels["slowmo start"], duration: () => tl.labels["slowmo start"] * INTRO_SPEED, ease: cubicBezier(1, 0.7, 1, 0.85) },
          { to: () => tl.labels["slowmo end"], duration: 850, ease: cubicBezier(0.0314, 0.3616, 0.8994, -0.2122) },
          { to: () => tl.duration, duration: () => (tl.duration - tl.labels["slowmo end"]) * INTRO_SPEED },
        ],
        duration: tl.duration,
        loop: false,
        ease: "linear",
        onComplete: () => {
          // The intro is over: drop the sky dome and solid scene background
          // so the canvas becomes transparent everywhere except the model
          // itself, then hand off to React state — the page's real content
          // renders on top of/around this from here on, the model just
          // keeps idling in place behind it (see the render loop above and
          // the JSX below).
          sky.visible = false;
          scene.background = null;
          finish();
        },
      });

      return () => {
        player.pause();
      };
    })();

    // Only tear the scene down if this component actually unmounts (it no
    // longer gets removed just because the intro finished — see `revealed`).
    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      themeObserver?.disconnect();
      stopTimer?.pause();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className={
        revealed
          ? "pointer-events-none fixed inset-0 -z-10"
          : "fixed inset-0 z-[200]"
      }
      style={{ background: revealed ? "transparent" : "var(--background)" }}
    />
  );
}

function tileRingDistance(i: number, floorSize: number) {
  return Math.hypot(
    (i % floorSize) - Math.floor(floorSize / 2),
    Math.floor(i / floorSize) - Math.floor(floorSize / 2)
  );
}

function getCenterTiles<T>(tiles: T[], floorSize: number, radius: number) {
  return tiles.filter((_, i) => tileRingDistance(i, floorSize) <= radius);
}

function getOuterTiles<T>(tiles: T[], floorSize: number, radius: number) {
  return tiles.filter((_, i) => tileRingDistance(i, floorSize) > radius);
}
