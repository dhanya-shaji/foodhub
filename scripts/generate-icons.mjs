// Generates PWA icons into public/icons. Run: node scripts/generate-icons.mjs
import sharp from "sharp";

const BG = "#f97316";

// `pad` shrinks the glyph so maskable icons keep it inside the safe zone.
const svg = (pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <g transform="translate(256 256) scale(${1 - pad}) translate(-256 -256)">
    <text x="256" y="330" font-family="Arial, Helvetica, sans-serif" font-size="230"
      font-weight="700" fill="#fff" text-anchor="middle">FH</text>
  </g>
</svg>`;

const jobs = [
  ["icon-192.png", 192, 0.1],
  ["icon-512.png", 512, 0.1],
  ["icon-512-maskable.png", 512, 0.3],
  ["apple-touch-icon.png", 180, 0.2],
];

for (const [file, size, pad] of jobs) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(`public/icons/${file}`);
  console.log("wrote", file);
}
