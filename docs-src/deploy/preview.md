---
id: deploy/preview
title: Set up a preview deploy
summary: Add a Preview environment before Production, so changes can be tried first.
screens: []
kind: how-to
video: { kind: recording, id: deploy-preview }
order: 20
---

# Set up a preview deploy

A preview environment lets you try a change on a real site before customers see it. You need the **project admin** role.

## If this is a new project

Open the **Deploy** tab. With no environments yet, it asks **How does this app ship?** Hadji pre-selects the closest answer from your GitHub branches.

1. Pick **Preview, then production**.
2. The picture shows the plan: your preview branch (often `dev`), then Preview, then your main branch, then Production.
3. Click **Continue**. Hadji creates both environments.

![Deploy tab, How does this app ship](shots/deploy-preview-1.png)

The other choices are **Just production** (one live site) and **Something else** (start blank and add each environment yourself).

If GitHub already knows your deployment environments, the tab first shows **Found on GitHub**. Tick the ones that belong to this app and click **Use these**. Each then shows what GitHub says is live, deploying or failed. Choose **Set up by hand** to leave this.

## If you already have Production

1. Click **+ Add environment**.
2. Answer the six questions:
   1. **Name** — for example Preview.
   2. **Where does it sit?** — before or after another environment.
   3. **Which code does it run?** — its own branch, or the same branch as the one before it.
   4. **Website address** — optional.
   5. **Who ships it?** — *Something else* (Vercel, Netlify, your own server), or *Hadji, using a GitHub Action*.
   6. **When?** — only when someone presses **Deploy**, or after every merge too.
3. Optional: name the GitHub environment its host reports to, so Hadji can show its status.
4. Click **Add**.

A live preview of the chain at the top of the panel shows where it will sit.

![Add environment panel](shots/deploy-preview-2.png)

## Using a GitHub Action

Pick the Action that does the deploy. Hadji starts it on the branch, and its runs show on the tab. The Action must have a `workflow_dispatch` trigger, or Hadji cannot start it.

## Check it worked

The new environment shows as a card. If it has an Action, it has a **Deploy now** button. If Hadji can track it, it says **Live** once the deploy is done.

![Preview environment showing Live](shots/deploy-preview-3.png)

## Next

[Release a change](/docs/deploy/release/) from Preview to Production.
