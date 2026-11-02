# Session settings

> Org-wide rules for sessions: asking first, CI alarms, fresh starts and graph memory.

# Session settings

Open **Settings → Sessions** under **Workspace**. It reaches everyone in the organization. Admins change it. Everyone else can read it.

![Session settings](https://hadji.ai/docs/media/shots/session-settings-1.png)

## Switches

- **Suggest the next message** — a session suggests what you could say next.
- **Let a session start other sessions** — a session may split work into new sessions.
- **Ask before changing code** — new sessions look and plan first, and wait for **Go**. See [Questions and approvals](/docs/sessions/questions-and-approvals/). A project can override this.

## Long sessions

A long session suggests wrapping up or a fresh start. You set how full it gets before that suggestion.

## CI alarm

When a session waits on CI, an alarm goes off if it takes too long.

- The alarm is a multiple of the repository's usual CI time.
- Until Hadji knows a repository's usual time, it uses the **fallback minutes** you set.

## Graph memory

Whether sessions keep a memory of the project that later sessions can search. A project can turn it on or off for itself.
