---
id: deploy/environments
title: The Deploy tab
summary: See your environments, what each one runs, and how a change moves between them.
screens: ["/o/*/p/*/deploys"]
kind: concept
order: 10
---

# The Deploy tab

The Deploy tab shows where your app runs, and moves changes from one place to the next.

![Deploy tab with Preview and Production](shots/deploy-environments-1.png)

## Environments

An environment is a place your app runs. Common ones are **Preview** (to try changes) and **Production** (what customers see). Each environment follows one Git branch.

The tab draws them in bands:

- **Code** — the branches.
- **Deploy** — the deploy that is running or last ran.
- **Running** — each environment's site, and what it is running now.

## Work lands on

At the top: **Work lands on** `dev` (or your branch). This is the branch sessions start from and open their pull requests into. By default it follows GitHub's default branch. A project admin can click **Change**.

## Status of an environment

- **Live** — running the newest code.
- **Deploying** — a deploy is in progress.
- **Deploy failed** — the last deploy did not work.
- **Unknown** or **Not tracked** — Hadji cannot tell. See below.

A deploy shows three stages: **Merged**, **Deploy**, **Live**.

## Tracking

Hadji learns an environment's status in two ways:

- From **GitHub deployments**, if your host (Vercel, Netlify and others) reports them. Fill in the GitHub environment name when you add the environment.
- From a **GitHub Action** that Hadji starts itself.

Without either, the environment reads **Not tracked**, and you check your host.

## Who can do what

- **Viewers** see everything and have no buttons.
- **Members** can press **Deploy now** and start a promotion.
- **Project admins** can add, edit and remove environments, and release.

## Hosts

If the project deploys through its own host, the tab says so. It is changed and deployed there.

## Next

- [Set up a preview deploy](/docs/deploy/preview/)
- [Release a change](/docs/deploy/release/)
- [How a change reaches production](/docs/how-it-works/change-to-production/)
