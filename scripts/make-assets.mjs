// Produces the derived images in public/. Run with: node scripts/make-assets.mjs
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicPath = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const source = publicPath("manisha-hero.webp");

// Phone hero: x280 y50 to x1150 y630, which removes the plant and the navy panel.
await sharp(source)
  .extract({ left: 280, top: 50, width: 870, height: 580 })
  .webp({ quality: 72 })
  .toFile(publicPath("manisha-hero-crop.webp"));

// Share image: 1200x630 at native scale, with her face near the centre.
await sharp(source)
  .extract({ left: 80, top: 40, width: 1200, height: 630 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(publicPath("og.jpg"));
