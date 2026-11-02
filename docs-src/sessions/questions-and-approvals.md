---
id: sessions/questions-and-approvals
title: Questions and approvals
summary: Answer an agent's question, press Go, or approve a request before work starts.
screens: []
kind: how-to
order: 30
---

# Questions and approvals

An agent sometimes stops and needs a person. There are three ways.

## 1. A question

The agent asks in the chat, often as a card with choices. The dot turns pink: **Question for you**.

1. Read the card.
2. Click a choice, or type your own answer.
3. Send it. The agent carries on.

Cards can have several questions and a review step before you send. Press **↑** in the message box to jump to the question.

![A question card](shots/questions-and-approvals-1.png)

## 2. Go (ask first)

When **Ask before changing code** is on, a new session first looks at the problem and posts a plan. A bar says **Waiting for your Go**.

- Until Go, the session can look and plan. It cannot push code, open a pull request or merge.
- Only the person who started the session sees the **Go** button. Everyone else sees who it waits on.
- A reply in chat does not count. Click **Go**.

An admin turns this on for the whole organization in [Session settings](/docs/settings/session-settings/), or for one project in [Project settings](/docs/settings/project-settings/).

![The Go bar](shots/questions-and-approvals-2.png)

## 3. An approval

Some sessions start from a request, such as an email sent to the project's inbound address. These are locked until the project owner decides. The bar says **Waiting for the project owner's call**.

Until approved, the session can only read and draw mockups.

- **Approve** — building starts as soon as you confirm. The confirm step has a message box. If the request came by email, the sender is emailed your message.
- **Decline** — nothing is built.
- **Ask for changes** — type in the message box. This does not decide anything, and the requester is not emailed.
- If the agent proposed options, the bar shows which one it recommends. You can pick another before approving.

![The approval bar](shots/questions-and-approvals-3.png)

The server holds these locks, not just the page. A locked session has no GitHub access at all.
