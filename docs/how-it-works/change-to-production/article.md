# How a change reaches production

> The path a change takes from a session to the live site, and who clicks what.

# How a change reaches production

A change does not go straight to your live site. It moves through steps, and you control the last one.

## The path

1. **A session makes the change** and opens a pull request into your work branch (for example `dev`).
2. **CI checks it.** Checks must pass.
3. **It merges into `dev`.** The change is now on the Preview environment. A deploy runs: by itself after the merge, or when someone presses **Deploy now**, depending on how Preview is set up.
4. **You look at Preview.** Try it on a real site, away from customers.
5. **A project admin releases it.** Click **Release to Production**. Hadji opens a pull request from `dev` into `main`.
6. **CI checks the release PR.** When it passes, Release merges it (a merge commit, not a squash).
7. **Production deploys.** Your host or an Action ships `main`. The Deploy tab says **Live** when it reports the new commit.

## Who does what

- **Sessions** make changes and open pull requests. They do not release.
- **Members** can press **Deploy now** and start a promotion.
- **Project admins** release.

## Release modes

How hands-on the release is can change:

- **Manual** — you open it and merge it.
- **Merge when I open** — you open it, and it merges once checks pass.
- **Fully automatic** — every change releases itself once checks pass.

## Only Production?

A project can have just one environment. Then merging to its branch is the whole path.

## Learn more

- [The Deploy tab](/docs/deploy/environments/)
- [Set up a preview deploy](/docs/deploy/preview/)
- [Release a change](/docs/deploy/release/)
