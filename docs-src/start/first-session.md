---
id: start/first-session
title: Your first session
summary: Start a session, ask for a small change, and follow it until it lands.
screens: []
kind: how-to
order: 20
---

# Your first session

You need a project first. If the list is empty, see [Add a project](/docs/projects/add-project/).

## Steps

1. Open your project and click **Sessions**.
2. Start a new session. Pick a model if you want one other than your default. You can change it later from the button in the message box.
3. Type what you want in plain words. Be specific. "Change the Contact button on the home page to say Talk to us" works better than "improve the page".
4. Press **Enter** to send.
5. Watch the colored dot beside the session. See [What the colors mean](/docs/sessions/status-colours/).

![Sessions tab, a new session with a message typed](shots/first-session-1.png)

## What happens next

- The agent reads your code and starts working. The dot says **Working**.
- It may ask you a question. The dot turns pink and says **Question for you**. Answer in the message box. See [Questions and approvals](/docs/sessions/questions-and-approvals/).
- When it is done, it opens a pull request on GitHub. The dot may say **Waiting on CI** while GitHub runs checks.
- When the work has landed, the dot says **Ready to archive**. Archive the session, or keep going.

![The session list showing a session that is Ready to archive](shots/first-session-2.png)

## Check your change

Open the **Deploy** tab to see where your change is running. See [The Deploy tab](/docs/deploy/environments/).

## Tips

- One session, one job. Start a new session for a new job.
- Press **Esc** to stop the agent while it works.
- If you are unsure what the agent did, use the [side chat](/docs/sessions/side-chat/). It answers without interrupting.
