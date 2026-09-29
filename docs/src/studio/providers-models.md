# Providers and models

Studio ships no model of its own. You connect a provider, then pick which model runs each turn from the [composer](/studio/interface/composer#model).

Settings → **Providers** (keys and endpoints) and the model list on each provider tile.

![](/assets/studio/providers.png)

### API key

Add a key from the Providers page. Pick the provider, paste the key.

### Subscription login

Where supported, sign in with a consumer plan instead of pasting a key (for example ChatGPT, GitHub Copilot, SuperGrok, OpenRouter, Chutes). Browser or device-code flows store a token beside your keys.

### Self-hosted providers <Badge type="pro"/><Badge type="team"/><Badge type="enterprise"/>

Attaching a local runtime (Ollama, LM Studio, llama.cpp, vLLM, ...) or defining a custom OpenAI-compatible base URL.

Vertex AI, Amazon Bedrock, and Azure OpenAI use their own auth (ADC, IAM, API keys, Entra). Configure them from the Providers page with the project, region, or resource your organisation requires.

> [!NOTE] Declared context vs served context
> Local runtimes often advertise the training context (for example 128k) while allocating a much smaller window from VRAM. Ollama may truncate oversized prompts **silently from the front**, which drops system instructions. Configure `num_ctx` / load context so the declared window matches what you serve, or the agent looks "dumb" when it was truncated.
>
> Self-hosted keeps prompts and tool output off third-party networks. Smaller local models are weaker at long tool-calling loops; a common pattern is local for sensitive material and a hosted model for hard reasoning on sanitised questions.

## Catalogue and discovery

Providers and model metadata come from [models.dev](https://models.dev). A snapshot ships with the extension so the picker works offline; it refreshes in the background when the network is available.

The catalogue is the general offer. Your account may differ. Studio asks each configured provider what it actually serves and reconciles that with the catalogue. What you see in the picker is what your key or session can call.

When a provider retires or renames a model, discovery follows. A missing model usually means it is gone upstream.

## Reasoning effort

Models with a thinking mode can be set to off, low, medium, or high, remembered per model. The control only appears when the model supports it.

Keep in mind that reasoning effort costs tokens. Reasoning tokens are billed and count against the context window. High effort on a long autonomous run is an easy way to a surprising invoice.

## Context

Every turn has to fit in the model's **context window**. The [context gauge](/studio/interface/composer#context-gauge) shows how full it is.

**Exegol System** is Studio's built-in layer: workspace layout, [approvals](/studio/behavior/approvals), follow-up behaviour, false-positive handling, where tools and wordlists live, aliases, and the rest of the cockpit contract. It keeps the model useful and controlled inside Exegol. It is **not** an editable system prompt: opening it would put approvals and tool routing at risk. Exegol keeps trimming it; expect incremental gains, not an empty shell you maintain yourself.

Everything else is yours and spends the same window: your messages, [personas](/studio/behavior/personas), the harness ([skills](/studio/knowledge/skills), [rules](/studio/knowledge/rules), [agents](/studio/knowledge/agents), [hooks](/studio/knowledge/hooks), [briefs](/studio/knowledge/briefs)), [MCPs](/studio/knowledge/mcp) you enable, and attachments or mentions from the [composer](/studio/interface/composer). A light persona and a lean harness leave more room; heavy always-on rules, large briefs, and many MCP schemas spend it faster.

When the gauge climbs, prefer levers on your side, or a larger window, over trying to gut Exegol System: trim persona / harness / MCP weight, pick a model with a larger window ([catalogue](#catalogue-and-discovery)), or compact (auto-compaction or `/compact`; detail is lost).

> [!NOTE] Why Exegol System stays closed
> Writable system prompts are a common request and a common way to break the product. Put methodology in the harness and tone in personas instead.
