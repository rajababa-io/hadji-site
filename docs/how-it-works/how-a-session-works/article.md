# How a session works

> What happens from your first message until the work is merged.

# How a session works

A session is one conversation with one agent about one job.

## The story, step by step

1. **You send a message.** The session gets its own sandbox: a private cloud computer with a copy of your code. Your laptop is never touched.
2. **The agent reads and plans.** If **Ask before changing code** is on, it posts a plan and waits for your **Go**. Until then it cannot push code, open a pull request or merge.
3. **The agent works.** It edits code in its sandbox, runs commands, and can show you pictures. The dot says **Working**.
4. **It asks when it needs you.** A question turns the dot pink. You answer in chat. See [Questions and approvals](/docs/sessions/questions-and-approvals/).
5. **It opens a pull request.** The work goes to GitHub, as you, on a branch based on where **work lands** (often `dev`).
6. **CI runs.** GitHub runs your checks. The dot says **Waiting on CI**, and the session is told when they finish.
7. **The change merges.** The pull request merges into your work branch. Preview may show it already.
8. **The work has landed.** The dot says **Ready to archive**. Archive the session, or keep going.

## What the agent can and cannot do

- It can use the secrets you gave it, and the internet hosts you allowed. See [Secrets](/docs/settings/secrets/) and [Sandbox network](/docs/settings/sandbox-network/).
- A locked session cannot touch GitHub at all.

## Your side chat

You can ask about a session while it works, without interrupting it. See [Side chat](/docs/sessions/side-chat/).

## When a session gets long

Context fills up. A session can write a handoff note and continue fresh. See [Cost and context](/docs/sessions/cost-and-context/).

## Next

[How a change reaches production](/docs/how-it-works/change-to-production/)
