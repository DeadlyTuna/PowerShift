import { SUN_DUTY, SUN_JITTER, SUN_RAYS, SUN_SEED } from "@/lib/sunburst";

export const vertexShader = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// three compiles a ShaderMaterial as "#version 300 es" and maps gl_FragColor,
// so fwidth and uint are core here and no glslVersion is needed.
export const fragmentShader = /* glsl */ `
precision highp float;
precision highp int;

uniform vec2 uRes;
uniform float uDpr;
uniform float uRise;
uniform float uSweep;
uniform float uTime;

const float PI = 3.141592653589793;
const float TAU = 6.283185307179586;
const float RAYS = ${SUN_RAYS.toFixed(1)};
const float WEDGE_HALF = ${(SUN_DUTY / 2).toFixed(4)};
const float JITTER = ${SUN_JITTER.toFixed(4)};

const vec3 RAY_GOLD = vec3(240.0, 215.0, 140.0) / 255.0;
const vec3 RAY_BLUE = vec3(126.0, 155.0, 230.0) / 255.0;
const vec3 CHAMPAGNE = vec3(239.0, 227.0, 196.0) / 255.0;

// Same steps as sunHash in lib/sunburst.ts.
float hash(float index) {
  highp uint x = uint(index + 0.5) * 2654435761u + ${SUN_SEED}u;
  x ^= x >> 15u;
  x *= 2246822519u;
  x ^= x >> 13u;
  return float(x) / 4294967295.0;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr - vec2(uRes.x * 0.5, 0.0);
  float R = 0.442 * uRes.y;
  vec2 C = vec2(0.0, mix(-0.6, 0.15, uRise) * R);
  vec2 q = p - C;
  float d = length(q);
  // The offset keeps atan defined if a pixel lands exactly on the centre.
  float a = atan(q.x, q.y + 0.0001);
  float aa = 0.75 / uDpr;

  // Rays. fwidth is taken before fract, so only the seam straight down from
  // the centre is discontinuous, and that is always below the horizon.
  float f = (a + PI) * RAYS / TAU + 0.01 * uTime * RAYS / TAU;
  float i = floor(f);
  float cell = fract(f);
  float w = min(fwidth(f), 0.5) * 0.75;
  float wedge = 1.0 - smoothstep(WEDGE_HALF - w, WEDGE_HALF + w, abs(cell - 0.5));

  // Drifting rays wrap, so ray 40 is ray 0 again and keeps its length.
  float rMax = R * mix(1.45, 2.1, uRise)
    * (1.0 + (hash(mod(i, RAYS)) - 0.5) * JITTER)
    * (1.0 + 0.015 * sin(uTime * TAU / 14.0));
  float rMin = 1.18 * R;
  float span = smoothstep(rMin - aa, rMin + aa, d) * (1.0 - smoothstep(rMax * 0.88, rMax, d));
  float rayAlpha = wedge * span;

  // The boundary ends 0.2 past the left horizon so that every ray still above
  // it is fully gold, matching the static SVG.
  float b = mix(0.0, -PI * 0.5 - 0.2, uSweep);
  vec3 rayColor = mix(RAY_BLUE, RAY_GOLD, smoothstep(b - 0.12, b + 0.12, a));

  vec3 color = rayColor * rayAlpha;
  float alpha = rayAlpha;

  // Glow, added with near-zero alpha so it brightens the royal behind it. The
  // window takes it to nothing at 1.4R instead of ending on a hard edge.
  float glow = 0.35 * exp(-(d - R) / (0.5 * R)) * (1.0 - smoothstep(R, 1.4 * R, d));
  color += RAY_GOLD * glow;
  alpha += glow * 0.02;

  // Ring, 2 CSS px.
  float ring = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, abs(d - 1.06 * R));
  color = mix(color, RAY_GOLD, ring);
  alpha = mix(alpha, 1.0, ring);

  // Disc, exactly the Champagne stock.
  float disc = 1.0 - smoothstep(R - aa, R + aa, d);
  color = mix(color, CHAMPAGNE, disc);
  alpha = mix(alpha, 1.0, disc);

  // Top fade. The edges of smoothstep must ascend, so this is inverted rather
  // than written with swapped edges, which GLSL leaves undefined.
  float fade = 1.0 - smoothstep(uRes.y * 0.82, uRes.y, p.y);
  color *= fade;
  alpha *= fade;

  // Dither, only where something is drawn, so empty canvas stays at zero.
  float noise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  color += (noise - 0.5) / 255.0 * step(0.001, alpha + glow);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
}
`;
