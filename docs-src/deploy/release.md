---
id: deploy/release
title: Release a change
summary: Move what runs on one environment to the next, usually Preview to Production.
screens: []
kind: how-to
order: 30
---

# Release a change

Releasing moves the code from one environment to the next one. Between two environments that use different branches, it is a pull request. Only a **project admin** releases.

## Steps

1. Open the **Deploy** tab.
2. On the environment you want to ship into, click **Release to Production** (or the name of your environment). If no pull request is open yet, the button reads **Open release PR →**.
3. A box asks once. It shows:
   - what goes (how many issues and other changes),
   - the pull request and whether its checks passed,
   - the three steps that follow.
4. Click **Release**.

![The release box](shots/deploy-release-1.png)

## The three steps

1. **Merge the pull request** into the next branch. It is a merge commit, never a squash, so the two branches stay in step.
2. **Ship it.** Either an Action starts by itself, or you press **Deploy now**, or your host picks it up.
3. **The page shows it live**, once the environment's deploy reports the new commit. Without tracking it says to check the environment yourself.

## If there is no pull request yet

The first click opens the pull request. Its checks run. Press **Release** again once they pass, and it merges.

## Release modes

Each step between environments has a mode:

- **Manual** — you open the release PR, and you merge it.
- **Merge when I open** — you open the release PR, and it merges itself once its checks pass.
- **Fully automatic** — every change opens a release PR and merges it once checks pass.

## Promote

Members can start a promotion. It opens the pull request from one environment's branch into the next, and says if one is already open. An admin completes the release.

## The merge queue

Under the chain, the tab shows where the merge queue stands. See [Project settings](/docs/settings/project-settings/) for Safe merging.

## Next

[How a change reaches production](/docs/how-it-works/change-to-production/)
