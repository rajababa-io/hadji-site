# What the colors mean

> The colored dot beside each session, and what it says about the session.

# What the colors mean

Every session has a dot. Click the **?** beside the session list to see the key in the console. The states, in the order a session lives through them:

- **Idle** — nothing is running in this session.
- **Working** — the agent is working on it right now.
- **Question for you** (pink) — the session is waiting for your answer. Work is held until you reply.
- **New reply** (pink) — the agent finished, and you have not read its reply yet. Nothing is blocked.
- **Waiting on CI** (yellow) — GitHub is running checks. The session is told when they finish. A small icon shows the step.
  - **Checking dev** or **Merged · checking dev** means the change is already on that branch, and its checks are still running.
- **Ready to archive** — the work has landed. Archive the session, or keep going.
- **Archived** — the session's work is finished.

![The status key](https://hadji.ai/docs/media/shots/status-colours-1.png)

## Who a pink dot is for

A pink dot counts for the person who started the session. Someone else's session waits on them, not on you. The count shows in the browser tab and on the phone app.

## Slow CI

If a CI wait runs much longer than usual for that repository, the console raises an alarm. An admin sets how long in [Session settings](/docs/settings/session-settings/).
