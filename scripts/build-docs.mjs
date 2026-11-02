#!/usr/bin/env node
// Builds the docs section: docs-src/<area>/<slug>.md  ->  docs/
//   docs/index.html, docs/videos/index.html, docs/manifest.json,
//   docs/<area>/<slug>/index.html + article.md, docs/assets/docs.{css,js}
// Zero dependencies. Run: node scripts/build-docs.mjs
// docs/media/ is NOT touched (recordings and explainers land there).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'docs-src');
const OUT = path.join(ROOT, 'docs');
const SITE = 'https://hadji.ai';
const APP = 'https://app.hadji.ai';
const KEEP = new Set(['media']); // folders inside docs/ the build never deletes

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const titleCase = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// ---------- front matter (small YAML subset: scalars, [a, b], one-level maps, "- item" lists) ----------
function scalar(v) {
  v = v.trim();
  if (v === '' || v === 'null' || v === '~') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('[') && v.endsWith(']')) return v.slice(1, -1).split(',').map(x => scalar(x)).filter(x => x !== null && x !== '');
  if (v.startsWith('{') && v.endsWith('}')) {
    return Object.fromEntries(v.slice(1, -1).split(',').map(p => { const i = p.indexOf(':'); return [p.slice(0, i).trim(), scalar(p.slice(i + 1))]; }));
  }
  if ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}
function parseFront(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const km = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!km) continue;
    const [, key, rest] = km;
    if (rest.trim() !== '') { data[key] = scalar(rest); continue; }
    const items = []; const map = {};
    while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
      i++;
      const l = lines[i].trim();
      if (l.startsWith('- ')) items.push(scalar(l.slice(2)));
      else { const j = l.indexOf(':'); if (j > 0) map[l.slice(0, j).trim()] = scalar(l.slice(j + 1)); }
    }
    data[key] = items.length ? items : Object.keys(map).length ? map : null;
  }
  return { data, body: m[2] };
}

// ---------- markdown (headings, paragraphs, lists, code, quotes, images, links, bold/italic/code) ----------
function mediaUrl(src, abs) {
  if (/^(https?:|data:)/.test(src)) return src;
  const p = src.startsWith('/') ? src : '/docs/media/' + src.replace(/^\.?\//, '');
  return abs ? SITE + p : p;
}
function inline(s, abs) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${esc(mediaUrl(u.replace(/&amp;/g, '&'), abs))}" alt="${a}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}"${/^https?:/.test(u) && !u.startsWith(SITE) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}
// Returns { html, headings: [{id, text, step}] }. "## 1. Do a thing" headings become numbered steps.
function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = []; const headings = []; const used = new Set();
  let i = 0, stepCount = 0;
  const para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para.length = 0; } };
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      flush(); const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flush();
      const level = h[1].length; let text = h[2].trim();
      if (level === 1) { i++; continue; } // the page title comes from front matter
      const sm = level === 2 && text.match(/^(\d+)[.)]\s+(.*)$/);
      let id = slugify(sm ? sm[2] : text) || 'section'; let n = 2; const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      if (sm) { stepCount++; headings.push({ id, text: sm[2], step: stepCount }); out.push(`<h2 id="${id}" class="step"><span class="badge">${stepCount}</span>${inline(sm[2])}</h2>`); }
      else { if (level === 2) headings.push({ id, text, step: 0 }); out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`); }
      i++; continue;
    }
    if (/^\s*([-*])\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l)) {
      flush(); const ordered = /^\s*\d/.test(l); const items = [];
      while (i < lines.length && (/^\s*([-*]|\d+[.)])\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+[.)])\s+/.test(lines[i])) items[items.length - 1] += ' ' + lines[i].trim();
        else items.push(lines[i].replace(/^\s*([-*]|\d+[.)])\s+/, ''));
        i++;
      }
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.map(x => `<li>${inline(x)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`); continue;
    }
    if (/^>\s?/.test(l)) {
      flush(); const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<aside class="note">${buf.join(' ').split(/\s{2,}|\n/).map(x => inline(x)).join('<br>')}</aside>`); continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { flush(); out.push('<hr>'); i++; continue; }
    if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(l)) { flush(); out.push(`<figure>${inline(l.trim())}</figure>`); i++; continue; }
    if (l.trim() === '') { flush(); i++; continue; }
    para.push(l.trim()); i++;
  }
  flush();
  return { html: out.join('\n'), headings, steps: stepCount };
}

// ---------- helpers ----------
function mp4Seconds(file) { // read the mvhd box; no ffprobe needed
  try {
    const b = fs.readFileSync(file);
    const at = b.indexOf('mvhd');
    if (at < 0) return null;
    const v = b[at + 4];
    const ts = b.readUInt32BE(at + (v === 1 ? 24 : 16));
    const dur = v === 1 ? Number(b.readBigUInt64BE(at + 28)) : b.readUInt32BE(at + 20);
    return ts ? Math.round(dur / ts) : null;
  } catch { return null; }
}
const clock = s => (s == null ? '' : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`);
function lastUpdated(file) {
  try {
    const d = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (d) return d;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}
const niceDate = iso => { const d = new Date(iso + 'T00:00:00Z'); return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); };

// ---------- load ----------
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []);
}
const articles = [];
for (const file of walk(SRC).sort()) {
  const rel = path.relative(SRC, file).split(path.sep);
  if (rel.length !== 2) { console.warn(`skip ${rel.join('/')}: expected docs-src/<area>/<slug>.md`); continue; }
  const area = rel[0], slug = rel[1].replace(/\.md$/, '');
  const { data, body } = parseFront(fs.readFileSync(file, 'utf8'));
  if (!data.title) { console.warn(`skip ${rel.join('/')}: no title`); continue; }
  const md = markdown(body);
  const video = data.video && data.video.id ? data.video : null;
  let vOut = null;
  if (video) {
    const secs = mp4Seconds(path.join(OUT, 'media', video.id + '.mp4')) ?? (typeof video.duration === 'number' ? video.duration : null);
    vOut = { kind: video.kind || 'recording', src: `${SITE}/docs/media/${video.id}.mp4`, poster: `${SITE}/docs/media/${video.id}.jpg`, duration: secs };
  }
  articles.push({
    area, slug, data, body, md, video: vOut,
    id: data.id || `${area}/${slug}`,
    url: `${SITE}/docs/${area}/${slug}/`,
    order: typeof data.order === 'number' ? data.order : 999,
    updated: lastUpdated(path.relative(ROOT, file)),
  });
}
const ids = new Set();
for (const a of articles) { if (ids.has(a.id)) throw new Error(`duplicate id ${a.id}`); ids.add(a.id); }
const byOrder = (a, b) => a.order - b.order || String(a.data.title).localeCompare(String(b.data.title)) || a.slug.localeCompare(b.slug);
const areas = [...new Set(articles.map(a => a.area))].sort().map(k => ({ key: k, title: titleCase(k), items: articles.filter(a => a.area === k).sort(byOrder) }));

// ---------- templates ----------
const head = (title, desc, urlPath) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#08090A">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icon-180.png">
<link rel="canonical" href="${SITE}${urlPath}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/docs/assets/docs.css">
</head>`;
const topbar = active => `<header><div class="bar">
  <a class="brand" href="/" aria-label="Hadji home"><img src="/assets/wordmark.svg" alt="Hadji"></a>
  <a class="docs-tag" href="/docs/">Docs</a>
  <form class="search" role="search" onsubmit="return false"><input id="q" type="search" placeholder="Search the docs" autocomplete="off" aria-label="Search the docs"><div id="results" class="results" hidden></div></form>
  <nav><a href="/docs/"${active === 'guides' ? ' class="on"' : ''}>Guides</a><a href="/docs/videos/"${active === 'videos' ? ' class="on"' : ''}>Videos</a><a href="/">Product</a><a class="pill" href="${APP}">Open Hadji</a></nav>
</div></header>`;
const footer = `<footer><div class="wrap"><span class="brand"><img src="/assets/wordmark.svg" alt="Hadji" style="height:20px"></span><span>© 2026 Hadji</span></div></footer>
<script src="/docs/assets/docs.js"></script>
</body></html>`;
const sidenav = cur => `<nav class="side" aria-label="Guides">${areas.map(a => `<h6>${esc(a.title)}</h6>${a.items.map(x => `<a href="/docs/${x.area}/${x.slug}/"${x === cur ? ' class="open" aria-current="page"' : ''}>${esc(x.data.title)}</a>`).join('')}`).join('')}</nav>`;
const card = x => `<a class="card" href="/docs/${x.area}/${x.slug}/"><b>${esc(x.data.title)}</b><span>${esc(x.data.summary || '')}</span>${x.video ? `<i class="vtag">▶ ${x.video.duration ? clock(x.video.duration) : 'Video'}</i>` : ''}</a>`;

function articlePage(a) {
  const d = a.data;
  const meta = [d.version || d.recorded ? `${a.video ? 'Recorded' : 'Written'} from Hadji ${d.version ? 'v' + String(d.version).replace(/^v/, '') : ''}${d.recorded ? ' on ' + niceDate(String(d.recorded)) : ''}`.replace(/\s+/g, ' ').trim() : `Updated ${niceDate(a.updated)}`,
    a.md.steps ? `${a.md.steps} step${a.md.steps === 1 ? '' : 's'}` : null,
    `about ${d.minutes || Math.max(1, Math.round(a.body.split(/\s+/).length / 180))} minute${(d.minutes || 0) === 1 ? '' : 's'}`].filter(Boolean).join(' · ');
  const area = areas.find(x => x.key === a.area);
  const v = a.video;
  const explainer = articles.find(x => x !== a && x.video && x.video.kind === 'explainer' && (x.data.screens || []).some(s => (d.screens || []).includes(s)));
  const toc = a.md.headings.map(h => `<a href="#${h.id}">${esc(h.text)}</a>`).join('');
  return `${head(`${d.title} — Hadji Docs`, d.summary || '', `/docs/${a.area}/${a.slug}/`)}
<body>
${topbar('guides')}
<div class="layout">
  ${sidenav(a)}
  <article class="doc">
    <div class="crumb"><a href="/docs/">Guides</a> / <b>${esc(area.title)}</b></div>
    <h1>${esc(d.title)}</h1>
    <p class="lead">${esc(d.summary || '')}</p>
    <p class="meta">${esc(meta)}</p>
    ${v ? `<div class="video" data-src="${v.src}">
      <video preload="metadata" playsinline poster="/docs/media/${esc(d.video.id)}.jpg"><source src="/docs/media/${esc(d.video.id)}.mp4" type="video/mp4"></video>
      <button class="play" aria-label="Play video"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
      <div class="vbar"><span class="chip">${v.kind === 'explainer' ? 'Explainer' : 'Screen recording'}</span><b>${esc(d.title)}</b><span class="time"><span class="cur">0:00</span> / <span class="dur">${v.duration ? clock(v.duration) : '--:--'}</span></span></div>
    </div>` : ''}
    <div class="prose">
${a.md.html}
    </div>
    <aside class="note ask"><b>Rather not click through it?</b> Ask Hadji to do it for you — type what you want in the chat and it does the steps. <a href="${APP}">Ask Hadji →</a></aside>
  </article>
  <aside class="rail">
    <div class="toc"><h6>On this page</h6>${toc || '<span class="dim">Short guide</span>'}</div>
    ${explainer ? `<a class="watch" href="/docs/${explainer.area}/${explainer.slug}/"><i>▶</i><b>Watch how it works</b><span>${esc(explainer.data.title)}</span></a>` : v ? `<a class="watch" href="#top" onclick="document.querySelector('.video .play').click();return false"><i>▶</i><b>Watch how it works</b><span>${clock(v.duration) || 'Short video'} · ${esc(d.title)}</span></a>` : ''}
  </aside>
</div>
${footer}`;
}
function homePage() {
  return `${head('Docs — Hadji', 'Guides and videos for Hadji, the AI software factory.', '/docs/')}
<body>
${topbar('guides')}
<main class="wrap home">
  <h1>Hadji Docs</h1>
  <p class="lead">Short guides, each with a screen recording. Find what you need, or search above.</p>
  ${areas.length ? areas.map(a => `<section><h2>${esc(a.title)}</h2><div class="cards">${a.items.map(card).join('')}</div></section>`).join('\n') : '<p class="dim">No guides yet.</p>'}
</main>
${footer}`;
}
function videosPage() {
  const vids = articles.filter(a => a.video).sort((a, b) => a.area.localeCompare(b.area) || byOrder(a, b));
  return `${head('Videos — Hadji Docs', 'Screen recordings and explainers for Hadji.', '/docs/videos/')}
<body>
${topbar('videos')}
<main class="wrap home">
  <h1>Videos</h1>
  <p class="lead">Every guide has a recording. Watch it, or open the guide for the steps.</p>
  <div class="cards vids">${vids.map(a => `<a class="card vid" href="/docs/${a.area}/${a.slug}/"><span class="thumb" style="background-image:url(/docs/media/${esc(a.data.video.id)}.jpg)"><i>▶</i><em>${a.video.duration ? clock(a.video.duration) : ''}</em></span><b>${esc(a.data.title)}</b><span>${esc(a.data.summary || '')}</span></a>`).join('') || '<p class="dim">No videos yet.</p>'}</div>
</main>
${footer}`;
}

// ---------- write ----------
fs.mkdirSync(OUT, { recursive: true });
for (const e of fs.readdirSync(OUT)) if (!KEEP.has(e)) fs.rmSync(path.join(OUT, e), { recursive: true, force: true });
const write = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
for (const a of articles) a.data.title = String(a.data.title);
for (const a of articles) {
  const dir = path.join(OUT, a.area, a.slug);
  write(path.join(dir, 'index.html'), articlePage(a));
  const md = a.body.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, u) => `![${alt}](${mediaUrl(u, true)})`).trim();
  write(path.join(dir, 'article.md'), `# ${a.data.title}\n\n${a.data.summary ? `> ${a.data.summary}\n\n` : ''}${md}\n`);
}
write(path.join(OUT, 'index.html'), homePage());
write(path.join(OUT, 'videos', 'index.html'), videosPage());
const manifest = articles.sort((a, b) => a.area.localeCompare(b.area) || byOrder(a, b)).map(a => ({
  id: a.id, title: a.data.title, summary: a.data.summary || '', url: a.url,
  screens: a.data.screens || [], kind: a.data.kind || 'guide', video: a.video, updated: a.updated,
}));
write(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of ['docs.css', 'docs.js']) fs.copyFileSync(path.join(ROOT, 'scripts', 'docs-assets', f), path.join(OUT, 'assets', f));
console.log(`docs: ${articles.length} article(s), ${areas.length} area(s)`);
