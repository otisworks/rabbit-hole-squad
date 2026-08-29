# @otisworks/rabbit-hole-squad

A simple multi-agent pipeline runner. No framework, no magic - just agents, tasks, and results.

Built for the **Rabbit Hole Essay Squadron**: a 6-agent team that researches obscure topics and produces weird, compelling essays.

## The Pipeline

```
Archive (Research) → Sphinx (Connect) → Muse (Write) → Critic (Fact-check) → Palette (Visuals) → Editor (Final)
```

1. **Archive** - Deep Research Archaeologist. Digs up obscure connections, forgotten history, and weird corners of a topic. Has web search.
2. **Sphinx** - Pattern Connector & Narrative Architect. Traces the rabbit hole, builds the narrative thread.
3. **Muse** - Weirdo Writer. Writes the actual essay with voice and personality.
4. **Critic** - Fact-Check Weirdo. Verifies claims, flags speculation, preserves the energy. Has web search.
5. **Palette** - Visual Cartographer. Suggests images, diagrams, and visual references to reinforce the narrative. *(optional)*
6. **Editor** - Final Polish Specialist. Takes the draft and fact-check feedback to produce a corrected, publish-ready version. *(optional)*

Each agent's output feeds into the next. The result: a researched, fact-checked, polished essay with visual recommendations.

## Requirements

- Node.js 18+
- Anthropic API key (or OpenAI, or OpenRouter)

## Setup

```bash
npm install
```

Set your API key:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Or create a `.env` file:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

```bash
# Run with default topic (full pipeline)
npm start

# Run with custom topic
node agent-team.js "The connection between Soviet space propaganda and 90s rave culture"

# Skip the final editor (get raw outputs to edit yourself)
node agent-team.js --raw "your topic"

# Skip visual recommendations
node agent-team.js --no-visuals "your topic"

# Skip both (just research → write → factcheck)
node agent-team.js --raw --no-visuals "your topic"
```

Outputs are saved to a timestamped folder:

```
output-2026-08-11T14-30-00-000Z/
├── 1-research.md
├── 2-narrative.md
├── 3-essay.md
├── 4-factcheck.md
├── 5-visuals.md      # if not --no-visuals
└── 6-final-essay.md  # if not --raw
```

## Configuration

### Switch models

```bash
# Use a different Anthropic model
ANTHROPIC_MODEL=claude-opus-5 npm start
```

### Use OpenAI instead

```bash
export LLM_PROVIDER=openai
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-5.6-terra  # optional, defaults to gpt-5.6-terra

npm start
```

### Use OpenRouter

OpenRouter lets you access many models (Claude, GPT, Llama, Mistral, etc.) through a single API.

```bash
export LLM_PROVIDER=openrouter
export OPENROUTER_API_KEY=sk-or-...
export OPENROUTER_MODEL=anthropic/claude-sonnet-4  # optional, see openrouter.ai/models

npm start
```

**Note:** Web search is not available through OpenRouter. The research and fact-check tasks will rely on the model's training knowledge instead.

### Use DeepSeek

DeepSeek offers powerful reasoning models at competitive prices.

```bash
export LLM_PROVIDER=deepseek
export DEEPSEEK_API_KEY=sk-...
export DEEPSEEK_MODEL=deepseek-chat  # optional, defaults to deepseek-chat (or use deepseek-reasoner for R1)

npm start
```

**Note:** Web search is not available through DeepSeek. The research and fact-check tasks will rely on the model's training knowledge instead.

Anthropic and OpenAI support web search for the research and fact-check tasks.

## How it works

It's just functions. No classes, no framework magic.

- `agents` - Object defining each agent's name, role, goal, and background
- `tasks` - Array of tasks with prompts that can reference previous results
- `callLLM()` - Handles API calls, with or without web search
- `runTeam()` - Executes tasks sequentially, passing results forward

The whole thing is ~600 lines of readable JavaScript.

## Future ideas

- [ ] Save outputs as each task completes (not just at the end)
- [ ] Resume from checkpoint if a task fails
- [ ] Streaming output during long tasks
- [ ] Batch mode for multiple topics (integrate with batch-kit)
- [ ] Config files for custom agents/pipelines

## License

MIT
