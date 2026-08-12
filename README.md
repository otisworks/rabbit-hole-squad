# @otisworks/rabbit-hole-squad

A simple multi-agent pipeline runner. No framework, no magic - just agents, tasks, and results.

Built for the **Rabbit Hole Essay Squadron**: a 5-agent team that researches obscure topics and produces weird, compelling essays.

## The Pipeline

```
Archive (Research) → Sphinx (Connect) → Muse (Write) → Critic (Fact-check) → Palette (Visuals)
```

1. **Archive** - Deep Research Archaeologist. Digs up obscure connections, forgotten history, and weird corners of a topic. Has web search.
2. **Sphinx** - Pattern Connector & Narrative Architect. Traces the rabbit hole, builds the narrative thread.
3. **Muse** - Weirdo Writer. Writes the actual essay with voice and personality.
4. **Critic** - Fact-Check Weirdo. Verifies claims, flags speculation, preserves the energy. Has web search.
5. **Palette** - Visual Cartographer. Suggests images, diagrams, and visual references to reinforce the narrative.

Each agent's output feeds into the next. The result: a researched, fact-checked essay with visual recommendations.

## Requirements

- Node.js 18+
- Anthropic API key (or OpenAI)

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
# Run with default topic
npm start

# Run with custom topic
node agent-team.js "The connection between Soviet space propaganda and 90s rave culture"
```

Outputs are saved to a timestamped folder:

```
output-2026-08-11T14-30-00-000Z/
├── 1-research.md
├── 2-narrative.md
├── 3-essay.md
├── 4-factcheck.md
└── 5-visuals.md
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
export OPENAI_MODEL=gpt-4o  # optional, defaults to gpt-4o

npm start
```

Note: Web search is only available with Anthropic. OpenAI runs will skip search and use training data only.

## How it works

It's just functions. No classes, no framework magic.

- `agents` - Object defining each agent's name, role, goal, and background
- `tasks` - Array of tasks with prompts that can reference previous results
- `callLLM()` - Handles API calls, with or without web search
- `runTeam()` - Executes tasks sequentially, passing results forward

The whole thing is ~500 lines of readable JavaScript.

## Future ideas

- [ ] Save outputs as each task completes (not just at the end)
- [ ] Resume from checkpoint if a task fails
- [ ] Streaming output during long tasks
- [ ] Revision loop (send essay back to Muse after Critic feedback)
- [ ] Batch mode for multiple topics (integrate with batch-kit)
- [ ] Config files for custom agents/pipelines

## License

MIT
