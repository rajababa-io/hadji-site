# Hadji explainers (Remotion)

Animated explainers written as code. `src/kit.tsx` is the shared scene kit (Box, Arrow, Cursor, Bubble, Branch, Terminal, Captions) in hadji.ai's look. Each explainer is one file; its composition id is its media id.

- `change-to-production` — issue → session → PR → CI → dev → Release → main → production
- `how-a-session-works` — ask → sandbox → your OK → PR → merge

```
npm ci
npm run studio          # preview and edit
npm run render          # → ../docs/media/<id>.mp4 + <id>.jpg
npm run render -- how-a-session-works
BROWSER_EXECUTABLE=/usr/bin/chromium npm run render   # use a local Chrome
```

Guides reference them with front matter `video: { kind: explainer, id: <id> }`.
The GitHub Action (`.github/workflows/explainers.yml`) re-renders on any change here. `node_modules` is git-ignored, so Pages never serves it.
To add one: new file, a `<Composition>` in `src/Root.tsx`, and a poster frame in `scripts/render.mjs`.
