export const SUN_RAYS = 40;
export const SUN_SEED = 7;
/** Share of each ray's pitch that the wedge covers. */
export const SUN_DUTY = 0.44;
/** Total spread of the hashed ray length, as a fraction of its length. */
export const SUN_JITTER = 0.16;

const KNUTH = 2654435761;
const MIX = 2246822519;

/**
 * Integer hash returning 0 to 1. shader.ts runs the same steps on uints, so a
 * ray has the same length in the SVG and on the GPU. A sin() hash would not:
 * JS doubles and GPU floats disagree.
 */
export function sunHash(index: number, seed: number = SUN_SEED): number {
  let x = (Math.imul(index, KNUTH) + seed) | 0;
  x ^= x >>> 15;
  x = Math.imul(x, MIX);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967295;
}

export type SunRay = {
  index: number;
  /** Radians. 0 is straight up, positive is right. */
  angle: number;
  innerRadius: number;
  outerRadius: number;
  /** Closed wedge path, centred on the origin. */
  wedge: string;
  /** The ray's centre line, for engraved single-stroke rays. */
  line: { x1: string; y1: string; x2: string; y2: string };
};

type SunburstOptions = {
  rays?: number;
  /** Sun radius in SVG units. */
  r: number;
  /** Where rays start, as a multiple of r. */
  inner: number;
  /** Nominal ray end, as a multiple of r, before the hashed length. */
  outer: number;
  seed?: number;
};

function fixed(value: number) {
  return value.toFixed(2);
}

function polar(radius: number, angle: number) {
  return `${fixed(radius * Math.sin(angle))} ${fixed(-radius * Math.cos(angle))}`;
}

/** Rays around the full circle, in the same order and at the same angles as the shader's cells. */
export function sunburstRays({
  rays = SUN_RAYS,
  r,
  inner,
  outer,
  seed = SUN_SEED,
}: SunburstOptions): SunRay[] {
  const pitch = (Math.PI * 2) / rays;
  const half = (pitch * SUN_DUTY) / 2;

  return Array.from({ length: rays }, (_, index) => {
    const angle = (index + 0.5) * pitch - Math.PI;
    const innerRadius = inner * r;
    const outerRadius = outer * r * (1 + (sunHash(index, seed) - 0.5) * SUN_JITTER);
    const a = fixed(outerRadius);
    const b = fixed(innerRadius);

    return {
      index,
      angle,
      innerRadius,
      outerRadius,
      wedge:
        `M${polar(innerRadius, angle - half)}` +
        `L${polar(outerRadius, angle - half)}` +
        `A${a} ${a} 0 0 1 ${polar(outerRadius, angle + half)}` +
        `L${polar(innerRadius, angle + half)}` +
        `A${b} ${b} 0 0 0 ${polar(innerRadius, angle - half)}Z`,
      line: {
        x1: fixed(innerRadius * Math.sin(angle)),
        y1: fixed(-innerRadius * Math.cos(angle)),
        x2: fixed(outerRadius * Math.sin(angle)),
        y2: fixed(-outerRadius * Math.cos(angle)),
      },
    };
  });
}
