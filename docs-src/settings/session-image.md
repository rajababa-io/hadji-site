---
id: settings/session-image
title: Session image and startup steps
summary: Choose what each session's sandbox has ready before the agent starts.
screens: ["/o/*?settings=chat-image", "/o/*?settings=my-chat-image"]
kind: how-to
order: 80
---

# Session image and startup steps

Every session runs in a cloud sandbox. Before the agent starts, the sandbox has tools installed and some commands run.

- **Workspace** — **Settings → Session image**. Tools baked into the image, and commands run as each session starts. Owners and admins change it. Saving rebuilds the image for every project the org shows.
- **Yours** — **Settings → Your startup steps**. Commands only your sessions run, such as your git name or a personal tool. They run after the workspace's and the project's.
- **A project** can run or skip the org's steps, and add its own. See [Project settings](/docs/settings/project-settings/).

![Session image](shots/session-image-1.png)

## Good to know

- Use secrets for passwords or keys. Never write them in a startup step. See [Secrets](/docs/settings/secrets/).
- Everyone else can read the workspace steps but not change them.
