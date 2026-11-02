#!/usr/bin/env node
// Checks the guides in docs-src/ against the shared contract (rajababa-io/hadji#1674).
// No dependencies: node docs-src/check.mjs
//
// Front matter is a small YAML subset: one `key: value` per line, values being a
// plain string, a JSON-style list (`screens`), or a flow map (`video`).

import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(import.meta.url))

/** Every console screen (route pattern) that needs exactly one guide. */
const REQUIRED_SCREENS = [
  "/new",
  "/sign-in",
  "/invite/*/*",
  "/o/*",
  "/o/*/issues",
  "/o/*/sessions",
  "/o/*/profile",
  "/o/*/settings",
  "/o/*/p/*",
  "/o/*/p/*/overview",
  "/o/*/p/*/overview/pictures",
  "/o/*/p/*/code-map",
  "/o/*/p/*/sessions",
  "/o/*/p/*/issues",
  "/o/*/p/*/deploys",
  "/o/*/p/*/files",
  // Settings is a window over a page: one pattern per section, as `?settings=`.
  ...[
    "preferences",
    "profile",
    "notifications",
    "phone",
    "ai",
    "my-instructions",
    "my-chat-image",
    "accounts",
    "organization",
    "members",
    "secrets",
    "chats",
    "models",
    "instructions",
    "network",
    "chat-image",
    "github",
    "audit",
    "projects/*",
    "projects/*/people",
    "projects/*/secrets",
  ].map((s) => `/o/*?settings=${s}`),
  // The phone app.
  "/m",
  "/m/settings",
  "/m/c/*",
  "/m/p/*/deploys",
  "/m/*",
  "/m/*/settings",
  "/m/*/chats",
  "/m/*/c/*",
  "/m/*/p/*",
  "/m/*/p/*/new",
]

/**
 * Screens left without a guide on purpose:
 *   /o/*?settings=private-databases  its guide was taken down (hadji-site#16)
 *   /admin, /founder/*               staff-only pages, not for customers
 */

const KINDS = ["how-to", "explainer", "concept"]
const VIDEO_KINDS = ["recording", "explainer"]
/** Videos the brief names: id -> the guide that carries it. */
const REQUIRED_VIDEOS = {
  "change-to-production": "how-it-works/change-to-production",
  "how-a-session-works": "how-it-works/how-a-session-works",
  "deploy-preview": "deploy/preview",
}

const errors = []
const fail = (file, msg) => errors.push(`${file}: ${msg}`)

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return path.endsWith(".md") ? [path] : []
  })
}

function parseValue(raw) {
  const v = raw.trim()
  if (v.startsWith("[")) return JSON.parse(v)
  if (v.startsWith("{")) {
    const inner = v.slice(1, v.lastIndexOf("}"))
    return Object.fromEntries(
      inner
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
          const i = p.indexOf(":")
          return [p.slice(0, i).trim(), p.slice(i + 1).trim()]
        })
    )
  }
  return v
}

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return null
  const data = {}
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":")
    if (i < 1) throw new Error(`not a "key: value" line: ${line}`)
    const key = line.slice(0, i).trim()
    if (key in data) throw new Error(`duplicate field ${key}`)
    data[key] = parseValue(line.slice(i + 1))
  }
  return { data, body: text.slice(m[0].length) }
}

const guides = []
for (const path of walk(root)) {
  const file = relative(root, path).split(sep).join("/")
  if (file === "README.md") continue
  // The generator's own fixtures (hadji#1675), written to an older contract; not guides.
  if (/\/sample-[^/]*\.md$/.test(file)) continue
  let parsed
  try {
    parsed = frontMatter(readFileSync(path, "utf8"))
  } catch (err) {
    fail(file, `front matter: ${err.message}`)
    continue
  }
  if (!parsed) {
    fail(file, "no front matter")
    continue
  }
  const { data, body } = parsed
  const known = ["id", "title", "summary", "screens", "kind", "video", "order"]
  for (const k of Object.keys(data)) if (!known.includes(k)) fail(file, `unknown field "${k}"`)

  const expectedId = file.replace(/\.md$/, "")
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(expectedId)) fail(file, "path must be <area>/<slug>.md in lower-case-with-dashes")
  if (data.id !== expectedId) fail(file, `id must be "${expectedId}", got "${data.id}"`)
  for (const k of ["title", "summary"]) {
    if (typeof data[k] !== "string" || data[k].trim() === "") fail(file, `${k} must be a non-empty line`)
  }
  if (typeof data.title === "string" && data.title.length > 80) fail(file, "title is over 80 characters")
  if (typeof data.summary === "string" && data.summary.length > 160) fail(file, "summary is over 160 characters")
  if (!Array.isArray(data.screens) || data.screens.some((s) => typeof s !== "string" || !s.startsWith("/"))) {
    fail(file, 'screens must be a list of route patterns starting with "/" ([] if none)')
  }
  if (!KINDS.includes(data.kind)) fail(file, `kind must be one of ${KINDS.join(" | ")}`)
  if (data.video !== undefined) {
    const v = data.video
    if (!VIDEO_KINDS.includes(v?.kind)) fail(file, `video.kind must be one of ${VIDEO_KINDS.join(" | ")}`)
    if (!/^[a-z0-9-]+$/.test(v?.id ?? "")) fail(file, "video.id must be lower-case-with-dashes")
    if (Object.keys(v ?? {}).some((k) => k !== "kind" && k !== "id")) fail(file, "video takes only kind and id")
  }
  if (!/^\d+$/.test(String(data.order))) fail(file, "order must be a whole number")
  if (!/^# \S/m.test(body)) fail(file, "body needs a # heading")
  guides.push({ file, ...data, body })
}

const ids = new Map()
for (const g of guides) {
  if (ids.has(g.id)) fail(g.file, `id also used by ${ids.get(g.id)}`)
  ids.set(g.id, g.file)
}
const orders = new Map()
for (const g of guides) {
  const area = g.id.split("/")[0]
  const key = `${area}:${g.order}`
  if (orders.has(key)) fail(g.file, `order ${g.order} is also used by ${orders.get(key)} in ${area}`)
  orders.set(key, g.file)
}

// Each screen pattern belongs to exactly one guide.
const owner = new Map()
for (const g of guides) {
  for (const s of Array.isArray(g.screens) ? g.screens : []) {
    if (owner.has(s)) fail(g.file, `screen "${s}" is also claimed by ${owner.get(s)}`)
    else owner.set(s, g.file)
  }
}
for (const s of REQUIRED_SCREENS) if (!owner.has(s)) fail("(coverage)", `no guide covers screen "${s}"`)
for (const s of owner.keys()) {
  if (!REQUIRED_SCREENS.includes(s)) fail(owner.get(s), `screen "${s}" is not in REQUIRED_SCREENS in check.mjs; add it there if it is real`)
}

// Videos: unique ids, and the ones the brief names sit on their guides.
const videos = new Map()
for (const g of guides) {
  if (!g.video) continue
  if (videos.has(g.video.id)) fail(g.file, `video id "${g.video.id}" is also used by ${videos.get(g.video.id)}`)
  videos.set(g.video.id, g.id)
}
for (const [vid, guide] of Object.entries(REQUIRED_VIDEOS)) {
  if (videos.get(vid) !== guide) fail("(videos)", `video "${vid}" must be on guide ${guide}`)
}

// Links to other guides must land on a guide.
for (const g of guides) {
  for (const m of g.body.matchAll(/\]\(\/docs\/([a-z0-9-]+\/[a-z0-9-]+)\/\)/g)) {
    if (!ids.has(m[1])) fail(g.file, `links to a guide that does not exist: ${m[1]}`)
  }
  for (const m of g.body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    if (!/^shots\/[a-z0-9-]+-\d+\.png$/.test(m[1])) fail(g.file, `screenshot placeholder "${m[1]}" should look like shots/<name>-<n>.png`)
  }
}

if (errors.length > 0) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"))
  console.error(`\n${errors.length} problem(s) in ${guides.length} guide(s).`)
  process.exit(1)
}
console.log(`✓ ${guides.length} guides, ${owner.size} screen patterns, ${videos.size} videos. All good.`)
