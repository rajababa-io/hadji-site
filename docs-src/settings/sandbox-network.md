---
id: settings/sandbox-network
title: Sandbox network
summary: Choose which internet hosts a session's sandbox can reach.
screens: ["/o/*?settings=network"]
kind: how-to
order: 100
---

# Sandbox network

Open **Settings → Sandbox network** under **Workspace**. It controls which internet hosts a session's sandbox can reach. It also controls whether sessions may open public web pages.

Admins change it. Everyone else can read it.

![Sandbox network](shots/sandbox-network-1.png)

## Allow a host

If a session cannot install a package or reach an API, the host may not be allowed. Add the host here, and new requests go through.

## Web pages

The web switch decides whether sessions may open public web pages.

## Good to know

- Allow only what you need.
- The engine checks every change again.
