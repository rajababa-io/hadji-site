# Project settings

> Per-project settings: safe merging, ask first, memory, requests and access.

# Project settings

Open **Settings** and click the project under **Projects**. These reach everyone on that project. Project admins change them.

(The old project settings address opens this window over the project's Overview.)

![Project settings](https://hadji.ai/docs/media/shots/project-settings-1.png)

## Code

- A link to the **Deploy** tab, which holds branches and environments. See [The Deploy tab](/docs/deploy/environments/).
- **Safe merging** — one switch for the merge queue, and batching on top of it. With it on, pull requests are tested before they merge.
  - If the queue was turned on outside Hadji, the page says **Merge queue only**: pull requests are tested one at a time.
- **Ask before changing code** — whether sessions in this project wait for **Go**. See [Questions and approvals](/docs/sessions/questions-and-approvals/).

## Access

- **People** — lower a person's role on this project. See [Members and roles](/docs/settings/members-roles/).
- **Secrets** — this project's secrets. See [Secrets](/docs/settings/secrets/).

## Memory

Whether the project keeps graph memory, so later sessions can search what earlier ones learned. A new project may ask you this once. Saving answers it.

## Requests

The project's inbound email address and which senders are allowed. A request that arrives this way waits for the project owner's approval before anything is built. See [Questions and approvals](/docs/sessions/questions-and-approvals/).

## Session image

Which of the organization's startup steps this project runs or skips, its own steps, and the image's build. See [Session image](/docs/settings/session-image/).
