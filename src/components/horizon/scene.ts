import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  NoBlending,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { fragmentShader, vertexShader } from "./shader";

export type HorizonTier = "mobile" | "desktop";

type HorizonOptions = {
  slot: HTMLElement;
  tier: HorizonTier;
  /** The first frame is on the canvas and the canvas is fading in. */
  onReady: () => void;
  /** WebGL has given up for this session. The SVG should come back. */
  onStop: () => void;
};

const FADE_MS = 400;
const GUARD_FRAMES = 30;
const GUARD_SLOW_MS = 22;
const GUARD_STOP_MS = 28;

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Returns a dispose function, safe to call more than once. */
export function mountHorizon({ slot, tier, onReady, onStop }: HorizonOptions): () => void {
  const dprCap = tier === "mobile" ? 1.25 : 1.5;
  const idleInterval = 1000 / (tier === "mobile" ? 20 : 30);
  // Mobile renders on every rAF while moving. Desktop holds to 60 on faster displays.
  const movingInterval = tier === "mobile" ? 0 : 1000 / 60 - 2;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
  } catch {
    onStop();
    return () => {};
  }

  let shaderFailed = false;
  renderer.debug.onShaderError = (gl, program) => {
    shaderFailed = true;
    console.error("Horizon shader failed:", gl.getProgramInfoLog(program));
  };
  renderer.setClearColor(0x000000, 0);

  let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  let width = slot.clientWidth;
  let height = slot.clientHeight;
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);

  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    display: "block",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    opacity: "0",
    transition: `opacity ${FADE_MS}ms ease-out`,
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
  );

  const uniforms = {
    uRes: { value: new Vector2(width, height) },
    uDpr: { value: dpr },
    uRise: { value: 0 },
    uSweep: { value: 0 },
    uTime: { value: 0 },
  };

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    blending: NoBlending,
  });

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  const scene = new Scene();
  scene.add(mesh);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function readTargets() {
    const rect = slot.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((0.95 * vh - rect.top) / (rect.height + 0.4 * vh), 0), 1);
    return { rise: 1 - (1 - p) ** 3, sweep: smoothstep(0.25, 0.95, p) };
  }

  let disposed = false;
  let contextLost = false;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;
  let firstFrame = 0;
  let onScreen = false;
  let running = false;

  let lastTick = 0;
  let lastRender = 0;
  let renderedLastTick = false;

  let guardSum = 0;
  let guardCount = 0;
  let guardStage = 0;

  function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimeout(fadeTimer);
    cancelAnimationFrame(firstFrame);
    renderer.setAnimationLoop(null);
    visibility.disconnect();
    resize.disconnect();
    document.removeEventListener("visibilitychange", syncLoop);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    if (!contextLost) renderer.forceContextLoss();
    canvas.remove();
  }

  /** Fades back to the SVG, then disposes. */
  function retreat() {
    renderer.setAnimationLoop(null);
    running = false;
    visibility.disconnect();
    document.removeEventListener("visibilitychange", syncLoop);
    canvas.style.opacity = "0";
    onStop();
    fadeTimer = setTimeout(dispose, FADE_MS);
  }

  function handleContextLost(event: Event) {
    event.preventDefault();
    contextLost = true;
    dispose();
    onStop();
  }

  function sampleGuard(frameMs: number) {
    guardSum += frameMs;
    guardCount += 1;
    if (guardCount < GUARD_FRAMES) return;

    const average = guardSum / guardCount;
    guardSum = 0;
    guardCount = 0;
    guardStage += 1;

    if (guardStage === 1 && average > GUARD_SLOW_MS) {
      dpr = 1;
      applySize();
    } else if (guardStage === 2 && average > GUARD_STOP_MS) {
      retreat();
    }
  }

  function tick(now: number) {
    const elapsed = now - lastTick;
    lastTick = now;

    // The gap after a rendered frame measures that frame, whatever the idle
    // throttle is doing. A long stall is capped so one hitch cannot decide it.
    if (renderedLastTick && guardStage < 2) {
      sampleGuard(Math.min(elapsed, 100));
      if (!running) return;
    }
    renderedLastTick = false;

    const dt = Math.min(Math.max(elapsed, 0) / 1000, 0.1);
    const k = 1 - Math.exp(-dt * 9);
    const targets = readTargets();
    const rise = uniforms.uRise.value + (targets.rise - uniforms.uRise.value) * k;
    const sweep = uniforms.uSweep.value + (targets.sweep - uniforms.uSweep.value) * k;
    const moving =
      Math.abs(targets.rise - rise) > 0.0005 || Math.abs(targets.sweep - sweep) > 0.0005;

    uniforms.uRise.value = rise;
    uniforms.uSweep.value = sweep;
    uniforms.uTime.value += dt;

    if (now - lastRender < (moving ? movingInterval : idleInterval)) return;

    renderer.render(scene, camera);
    lastRender = now;
    renderedLastTick = true;
  }

  function syncLoop() {
    const shouldRun = onScreen && document.visibilityState === "visible";
    if (shouldRun === running || disposed) return;
    running = shouldRun;
    if (running) {
      lastTick = performance.now();
      renderedLastTick = false;
      renderer.setAnimationLoop(tick);
    } else {
      renderer.setAnimationLoop(null);
    }
  }

  function applySize() {
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    uniforms.uRes.value.set(width, height);
    uniforms.uDpr.value = dpr;
    renderer.render(scene, camera);
  }

  const visibility = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    syncLoop();
  });

  const resize = new ResizeObserver(() => {
    const nextWidth = slot.clientWidth;
    const nextHeight = slot.clientHeight;
    if (nextWidth === width && Math.abs(nextHeight - height) <= 2) return;
    width = nextWidth;
    height = nextHeight;
    applySize();
  });

  canvas.addEventListener("webglcontextlost", handleContextLost);
  slot.appendChild(canvas);

  // First frame at the current scroll position, so there is no climb from zero.
  // It runs even if the slot is still offscreen, so the crossfade is over before
  // the visitor arrives, and shader compilation does not land mid-scroll.
  firstFrame = requestAnimationFrame(() => {
    const targets = readTargets();
    uniforms.uRise.value = targets.rise;
    uniforms.uSweep.value = targets.sweep;
    renderer.render(scene, camera);

    if (shaderFailed) {
      dispose();
      onStop();
      return;
    }

    canvas.style.opacity = "1";
    onReady();
    visibility.observe(slot);
    resize.observe(slot);
    document.addEventListener("visibilitychange", syncLoop);
  });

  return dispose;
}
