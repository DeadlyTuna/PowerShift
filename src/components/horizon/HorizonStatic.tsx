import { sunburstRays } from "@/lib/sunburst";

const R = 230;
// The shader's last frame: mix(-0.6, 0.15, 1) * R above the horizon.
const CENTRE_Y = -0.15 * R;
const HEIGHT = 520;
const GOLD = "#F0D78C";
const CHAMPAGNE = "#EFE3C4";
// Ray gold plus royal-deep, clamped. Painted at the glow's alpha this lands on
// the shader's additive result, which an ordinary SVG blend cannot do directly.
const GLOW_ADDITIVE = "#FFFFF9";

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

const rays = sunburstRays({ r: R, inner: 1.18, outer: 2.1 }).filter(
  (ray) => Math.abs(ray.angle) < Math.PI / 2 + 0.15,
);

const GLOW_REACH = 1.4;
const glowStops = [1, 1.1, 1.2, 1.3, 1.4].map((distance) => ({
  offset: (distance / GLOW_REACH).toFixed(4),
  alpha: (
    0.35 *
    Math.exp(-(distance - 1) / 0.5) *
    (1 - smoothstep(1, GLOW_REACH, distance))
  ).toFixed(4),
}));

// Tip fade over the last 12% of a ray, on the shader's smoothstep curve.
const tipStops = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
  offset: (0.88 + t * 0.12).toFixed(3),
  alpha: (1 - smoothstep(0, 1, t)).toFixed(3),
}));

// Top fade from 82% of the slot height to its top edge.
const topStops = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
  offset: t,
  alpha: smoothstep(0, 1, t).toFixed(3),
}));

/** The scene's last frame, in the server HTML. Height drives scale, so R is 0.442 of the slot. */
export function HorizonStatic() {
  return (
    <svg
      viewBox={`-600 ${-HEIGHT} 1200 ${HEIGHT}`}
      preserveAspectRatio="xMidYMax meet"
      className="absolute bottom-0 left-1/2 h-full max-w-none -translate-x-1/2 aspect-[1200/520]"
      focusable="false"
    >
      <defs>
        <radialGradient id="sun-tip" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1">
          <stop offset="0" stopColor={GOLD} />
          {tipStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={GOLD}
              stopOpacity={stop.alpha}
            />
          ))}
        </radialGradient>
        {rays.map((ray) => (
          <radialGradient
            key={ray.index}
            id={`sun-ray-${ray.index}`}
            href="#sun-tip"
            r={ray.outerRadius.toFixed(2)}
          />
        ))}
        <radialGradient
          id="sun-glow"
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r={(GLOW_REACH * R).toFixed(2)}
        >
          {glowStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={GLOW_ADDITIVE}
              stopOpacity={stop.alpha}
            />
          ))}
        </radialGradient>
        <linearGradient
          id="sun-top-ramp"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={-HEIGHT}
          x2="0"
          y2={-0.82 * HEIGHT}
        >
          {topStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor="#FFFFFF"
              stopOpacity={stop.alpha}
            />
          ))}
        </linearGradient>
        <mask
          id="sun-top-fade"
          maskUnits="userSpaceOnUse"
          x="-600"
          y={-HEIGHT}
          width="1200"
          height={HEIGHT}
        >
          <rect x="-600" y={-HEIGHT} width="1200" height={HEIGHT} fill="url(#sun-top-ramp)" />
        </mask>
      </defs>
      <g mask="url(#sun-top-fade)">
        <g transform={`translate(0 ${CENTRE_Y})`}>
          {rays.map((ray) => (
            <path key={ray.index} d={ray.wedge} fill={`url(#sun-ray-${ray.index})`} />
          ))}
          <circle r={GLOW_REACH * R} fill="url(#sun-glow)" />
          <circle
            r={1.06 * R}
            fill="none"
            stroke={GOLD}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <circle r={R} fill={CHAMPAGNE} />
        </g>
      </g>
    </svg>
  );
}
