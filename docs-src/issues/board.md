---
id: issues/board
title: The Issues board
summary: See your GitHub issues in five columns, for one project or all of them.
screens: ["/o/*/issues", "/o/*/p/*/issues"]
kind: concept
order: 10
---

# The Issues board

The board shows your GitHub issues. It is read-only: you cannot edit an issue here. Edit it on GitHub.

- **All projects** shows every project's issues together. Each project is read with your own access. One that cannot be read is named, not silently missing.
- **A project's Issues tab** shows just that project.

![Issues board](shots/issues-board-1.png)

## The columns

- **Todo** — open, with nothing else known about it.
- **Blocked** — labelled `status: blocked`.
- **In Progress** — labelled `status: in progress`.
- **In Review** — labelled `status: in review`, or an open pull request closes it.
- **Done** — the issue is closed.

## Tools

- Project buttons at the top show only one project. The number is its issue count.
- The refresh button reads GitHub again.
- **Columns** hides the ones you do not want.
- Hover a card for its description and why it sits in its column. Parent issues show how many sub-issues are closed. Click a parent to show only it and its sub-issues.
- Right-click a card to **Open on GitHub**, **Copy link**, or **Start session**.

## Next

[Start a session from an issue](/docs/issues/start-from-issue/)
