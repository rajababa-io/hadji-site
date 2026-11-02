// Usage: node scripts/render.mjs [id ...]   (default: all explainers)
// Writes ../docs/media/<id>.mp4 and <id>.jpg (poster, taken a few seconds in).
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.resolve(root, '../docs/media');
const ALL = {'change-to-production': 1950, 'how-a-session-works': 1500}; // id → poster frame
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ALL);
mkdirSync(out, {recursive: true});
const browser = process.env.BROWSER_EXECUTABLE ? [`--browser-executable=${process.env.BROWSER_EXECUTABLE}`] : [];
const remotion = (...a) => execFileSync('npx', ['remotion', ...a, ...browser], {cwd: root, stdio: 'inherit'});
for (const id of ids) {
  if (!(id in ALL)) throw new Error(`unknown explainer: ${id}`);
  remotion('render', 'src/index.ts', id, path.join(out, `${id}.mp4`), '--codec=h264', '--pixel-format=yuv420p');
  remotion('still', 'src/index.ts', id, path.join(out, `${id}.jpg`), `--frame=${ALL[id]}`, '--image-format=jpeg');
}
