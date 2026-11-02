# hadji.ai

Marketing page for Hadji. Plain static HTML served by GitHub Pages from `main`;
the custom domain is set by `CNAME`. DNS lives on Cloudflare (zone `hadji.ai`).

Waitlist answers go to the Google Form "Hadji — request early access"
(owner ameet@rajababa.io). Tracked in rajababa-io/hadji#20.

## Docs (hadji.ai/docs)

Write guides as `docs-src/<area>/<slug>.md` (front matter: `id, title, summary, screens,
kind, video {kind, id}, order`; optional `version, recorded, minutes`). Number step
headings like `## 1. Do the thing`. Run `node scripts/build-docs.mjs` to build `docs/`
(pages, `docs/manifest.json`, `docs/<area>/<slug>/article.md`). A GitHub Action rebuilds
and commits `docs/` when `docs-src/` changes on `main`. Videos: `docs/media/<id>.mp4` + `.jpg`
(the build never touches `docs/media/`). Files named `sample-*` are placeholders; delete them
when real guides land.
