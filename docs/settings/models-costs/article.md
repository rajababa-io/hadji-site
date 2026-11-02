# Models and costs

> Set the workspace's default models, backups and each model's context limit.

# Models and costs

Open **Settings → AI models** under **Workspace**. It reaches everyone in the organization who has not picked their own.

Admins change it. Everyone else can read it.

![AI models, workspace](https://hadji.ai/docs/media/shots/models-costs-1.png)

## Workflow sizes and backup

Set what each size (Small, Medium, Large) runs on, and the backup sessions switch to when a model runs out. People can override this for themselves in [AI models and agents](/docs/settings/ai-models-agents/).

## Context limits

Each model can take in only so much text. This panel lists each model's limit. It says **Published by the vendor** when Hadji knows the number, and **No published value yet** when it does not. An admin can type a limit, such as `200000` or `200K`.

The limit is what the context meter measures against. See [Cost and context](/docs/sessions/cost-and-context/).

## Watching cost

Each session shows what it has cost, in session details. To spend less:

- Use **Small** and **Medium** sizes for simple jobs.
- Start a new session for a new job, instead of one very long one.
