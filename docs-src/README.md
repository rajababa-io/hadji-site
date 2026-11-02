# docs-src

Source of the Hadji guides, published once at `https://hadji.ai/docs/<area>/<slug>/`.
The console links to them and reads them; it never copies them.
Tracked in rajababa-io/hadji#1674.

One markdown file per guide: `docs-src/<area>/<slug>.md`.

```yaml
---
id: deploy/preview            # must equal the path, without .md
title: Set up a preview deploy
summary: one line
screens: ["/o/*/p/*/deploys"] # console route patterns this guide is the Help for; [] if none
kind: how-to                  # how-to | explainer | concept
video: { kind: recording, id: deploy-preview }   # optional; kind is recording | explainer
order: 10                     # sort order inside its area
---
```

## Rules

- Plain 8th-grade English. Write what the console does today.
- Each screen pattern is claimed by **one** guide. Settings is a window over a page, so a
  section is written `/o/*?settings=<section>`.
- Link to other guides as `[text](/docs/<area>/<slug>/)`.
- Screenshots come later from the recording pipeline. Leave a placeholder:
  `![Deploy tab, Preview row](shots/deploy-preview-1.png)`.
- Front matter is a small YAML subset: one `key: value` per line.

## Check

```
node docs-src/check.mjs
```

Checks every field, that screen patterns are unique, that every console screen listed in
`check.mjs` is covered, that the three videos (`change-to-production`, `how-a-session-works`,
`deploy-preview`) sit on their guides, and that links and placeholders resolve.

## Left out on purpose

- Private databases (`?settings=private-databases`): its guide was taken down in #17.
- `/admin` and `/founder/*`: staff-only pages.
- Add project is a dialog with no address, so its guide has `screens: []`; the All projects guide links to it.
