# Cost and context

> What the cost figure and the context meter in a session mean.

# Cost and context

Open **Session details** in a session to see both.

## Context

Context is how much of the agent's working memory is used. A session with a lot of history is slower and can lose track of early details.

- The meter shows how full it is, against the model's limit.
- It turns **amber at 40%** and **red at 60%**. That is the point where wrapping up starts to pay off.
- If Hadji does not know a model's limit, it shows no percentage rather than guess.

An admin sets how full a session gets before it suggests a fresh start, in [Session settings](/docs/settings/session-settings/), and each model's limit in [Models and costs](/docs/settings/models-costs/).

![Session details with cost and context](https://hadji.ai/docs/media/shots/cost-and-context-1.png)

## Cost

The cost is what the session has used so far, in US dollars. Anything under one cent shows as **<$0.01**. Side chat answers are included. Cost shows in session details only.

## When a model runs out

If a model hits its usage limit, Hadji can switch the session to a backup model. See [AI models and agents](/docs/settings/ai-models-agents/).
