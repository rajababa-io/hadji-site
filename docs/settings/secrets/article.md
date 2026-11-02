# Secrets

> Store passwords and keys safely, at the org, project or personal level.

# Secrets

A secret is a key, token or password a session needs, such as an API key. Never type one into a chat or commit it to code. Put it here instead.

Open **Settings → Secrets**. You see every record you may see on one page.

![Secrets page](https://hadji.ai/docs/media/shots/secrets-1.png)

## Three layers

- **Org** — set by org admins. Reaches the projects it names, or all of them.
- **Project** — set by each project's admins. Reaches that project.
- **Personal** — yours only. Nobody else sees these, even their names.

A record holds one or more **fields**. Each field has a label and an **env var name**, such as `STRIPE_SECRET_KEY`. Sessions get the value under that name.

## Add one

1. Use the add button and choose the layer: org, project or personal.
2. Start from a template (for example AWS or Stripe), or fill in your own fields.
3. Paste the values and save.

Saved values are not shown again. When you edit a record, a field says **Saved — leave blank to keep**.

![A secret record](https://hadji.ai/docs/media/shots/secrets-2.png)

## Which value a session gets

If the same env var is set in more than one layer, the nearest layer wins:

1. **Org, locked** — beats everything.
2. **Personal** — beats project and org.
3. **Project** — beats org.
4. **Org** — the base.

The page marks a record **overridden** when another one wins, and has a panel for env vars set in more than one layer. An org admin can **lock** a record so it wins everywhere it reaches.

## Reveal

An org owner or admin can reveal an org secret. **Every reveal is in the audit log.**

## Who can do what

- Everyone can list their own and see org records.
- Only org admins write, reveal and lock org secrets.
- Project admins manage that project's secrets.

## Good to know

- Rotate a key if you think it leaked.
- Keys that Hadji itself runs on are shown as names only.
