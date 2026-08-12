/**
 * Simple Multi-Agent Team Runner
 * No framework BS - just agents, tasks, and results.
 * 
 * Supports: Anthropic (default) or OpenAI
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  provider: process.env.LLM_PROVIDER || "anthropic", // "anthropic" or "openai"
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4o",
  },
  maxTokens: 16384,
};

// ============================================
// AGENTS
// ============================================

const agents = {
  archive: {
    name: "Archive",
    role: "Deep Research Archaeologist",
    goal: "Uncover obscure connections, unexpected angles, and hidden threads in niche histories, art movements, and subcultures.",
    background: `Expert in art history, underground movements, countercultures, and archival research. 
Skilled at finding the weird corners of Wikipedia, academic papers, obscure source material, and forgotten cultural artifacts. 
Knows how to spot patterns across disciplines.`,
  },

  sphinx: {
    name: "Sphinx",
    role: "Pattern Connector & Narrative Architect",
    goal: "Trace unexpected connections between disparate topics and build a coherent thread that makes the rabbit hole compelling and followable.",
    background: `Specializes in narrative structure, thematic connections, and revealing how seemingly unrelated ideas are secretly connected. 
Excels at the "wait, these two things are connected HOW?" moments that make rabbit holes work.`,
  },

  muse: {
    name: "Muse",
    role: "Weirdo Writer",
    goal: "Transform research and connections into an engaging, voice-forward essay that invites readers into the rabbit hole while maintaining authenticity and readability.",
    background: `Creative writer with a distinct voice. Knows how to balance weirdness with clarity. 
Makes complex topics accessible without dumbing them down.`,
  },

  critic: {
    name: "Critic",
    role: "Fact-Check Weirdo",
    goal: "Verify claims and sanity-check the narrative while preserving the energy and weirdness that makes the essay work.",
    background: `Rigorous researcher with genuine interest in unconventional topics. 
Knows the difference between "speculative but fascinating" and "just factually wrong". 
Committed to keeping the vibe alive while staying defensible.`,
  },

  palette: {
    name: "Palette",
    role: "Visual Cartographer",
    goal: "Identify where images, diagrams, visual references, and multimedia elements could deepen and reinforce the rabbit hole narrative.",
    background: `Digital artist, photographer, and visual thinker. 
Understands how visuals create mood, guide readers through complex ideas, and reinforce connections. 
Thinks in mood boards, visual metaphors, and reference collections.`,
  },
};

// ============================================
// TASKS
// ============================================

const tasks = [
  {
    id: "research",
    agent: "archive",
    useWebSearch: true, // Enable web search for this task
    description: (inputs) => `Research the topic: ${inputs.topic}

YOU HAVE ACCESS TO WEB SEARCH. Use it aggressively to find obscure sources, verify claims, and dig deeper.

Go deep.

Find the weird corners, unexpected connections, obscure references, and lesser-known history.

Look for:
- Lesser-known figures or movements
- Subcultures and art movements that intersect
- Contradictions and forgotten trends
- Cross-disciplinary connections
- Strange historical coincidences
- Failed experiments and abandoned ideas
- Influences that are rarely discussed
- Primary sources and contemporary accounts
- Academic or institutional sources
- The stuff that makes you go "wait, THAT happened?"

For every important claim, try to identify where the information came from.

Compile your findings as a structured research dump containing:

1. Key figures
2. Key movements
3. Important works
4. Timeline events
5. Unexpected connections
6. Obscure references
7. Contradictions or competing interpretations
8. Useful primary or secondary sources
9. The 3-5 weirdest angles worth exploring further

Do not merely summarize the obvious history. Actively search for the rabbit holes.`,
    expectedOutput: `Detailed research findings including key figures and movements, timeline of events, 
unexpected cross-disciplinary connections, obscure references, contradictions or failed experiments, 
useful sources, and the 3-5 weirdest angles worth exploring further.`,
  },

  {
    id: "connect",
    agent: "sphinx",
    description: (inputs, results) => `Take this research data:

${results.research}

Now trace the rabbit hole.

Your job is to build the NARRATIVE THREAD - not a list, but a path through the chaos.

Find the connections that make people go: "Oh SHIT. They're connected?"

Determine:
- Which research threads lead naturally to others
- Where the pivot points are
- Where the rabbit hole goes sideways
- What the emotional or philosophical throughline is
- Which connections are strongest
- Which connections are speculative
- Which connections are supported by evidence
- How someone unfamiliar with the subject could follow the descent

Create a story structure:

Opening hook
- First thread
- Where it leads
- Unexpected turn
- Deeper layer
- Philosophical interpretation
- Conclusion that reframes everything

Prioritize surprising but defensible connections over arbitrary associations.

If a connection is speculative, mark it as such rather than presenting it as historical fact.`,
    expectedOutput: `A narrative structure/outline showing the opening hook, main threads in order, 
pivot points where the story shifts, unexpected connections that land hardest, 
speculative connections that require careful framing, and a conclusion that ties the rabbit hole together.`,
  },

  {
    id: "write",
    agent: "muse",
    description: (inputs, results) => `You have research findings:

${results.research}

And the narrative structure:

${results.connect}

Now WRITE THE ESSAY.

Use the narrative structure as your skeleton, but write in your own voice.

Be genuinely weird, but guide the reader.

Use the research to back up claims. Make connections explicit. Don't be afraid to go on tangents if they serve the vibe.

The goal: Someone reads this and goes, "I didn't expect to care about this, but now I'm three hours deep."

Write the full essay, approximately 2000-3000 words.

Requirements:
- Killer opening that hooks immediately
- Clear section breaks following the narrative thread
- Specific historical and cultural references
- Explicit connections between ideas
- Philosophical interpretation rather than merely historical summary
- A distinct voice and personality
- Tangents are welcome when they illuminate the rabbit hole
- Clearly distinguish established fact from interpretation or speculation
- Use citations/references where appropriate
- End with either a satisfying reframing or an intentionally unresolved question

Write in markdown format.`,
    expectedOutput: `Complete essay draft in markdown format, approximately 2000-3000 words. 
Engaging, weird, voice-forward, coherent, and followable.`,
  },

  {
    id: "factcheck",
    agent: "critic",
    useWebSearch: true, // Enable web search for fact-checking
    description: (inputs, results) => `Read this essay:

YOU HAVE ACCESS TO WEB SEARCH. Use it to independently verify claims, check dates, names, and facts.

${results.write}

Compare it against the original research:

${results.research}

Go through the essay and:

1. Identify claims supported by the research
2. Flag claims that need additional fact-checking or citation
3. Identify statements that are speculative
4. Check whether speculative claims are appropriately labeled
5. Check that references, names, dates, and works are accurate
6. Check that the narrative logic actually holds
7. Identify claims that need softening
8. Identify claims that are MORE interesting than the essay currently allows
9. Find places where better evidence could make the argument stronger
10. Preserve the energy and weirdness - do not sanitize the piece

Provide feedback in five sections:

1. Things that are solid
2. Things that need fact-checking or citation
3. Speculative claims and whether they are properly labeled
4. Places where we could lean HARDER into the weirdness
5. Overall assessment: is this defensible and publishable?`,
    expectedOutput: `Detailed fact-checking notes containing verified claims, flagged speculative sections, 
citation needs, corrections, suggestions for stronger claims, and overall assessment.`,
  },

  {
    id: "visuals",
    agent: "palette",
    description: (inputs, results) => `You have the final essay:

${results.write}

And the fact-checker's feedback:

${results.factcheck}

Now think visually.

Determine where images, diagrams, visual references, or multimedia elements could REINFORCE the rabbit hole.

For each major section or key moment, suggest:

- What visual would work
- Where it should appear
- Why it matters to the narrative
- What mood/style it should have
- Whether it should be historical, documentary, diagrammatic, artistic, photographic, or conceptual
- 2-3 possible reference examples
- Where the appropriate source could be found

Think about:
- Archive photographs
- Historical references
- Mood boards
- Connection diagrams
- Visual metaphors
- Art/design references
- Subculture imagery
- Timelines
- Maps
- Primary-source documents
- Album artwork
- Posters
- Graffiti
- Ephemera

Create a visual blueprint that could guide the design or illustration of the finished essay.`,
    expectedOutput: `Visual recommendations organized by essay section. For each visual: description, 
placement in the text, narrative purpose, mood/style notes, and 2-3 reference examples.`,
  },
];

// ============================================
// LLM CLIENT
// ============================================

function createClient() {
  if (CONFIG.provider === "anthropic") {
    return new Anthropic({ apiKey: CONFIG.anthropic.apiKey });
  } else {
    return new OpenAI({ apiKey: CONFIG.openai.apiKey });
  }
}

/**
 * Call LLM without tools (simple completion)
 */
async function callLLMSimple(client, agent, prompt) {
  const systemPrompt = `You are ${agent.name}, a ${agent.role}.

Your goal: ${agent.goal}

Background: ${agent.background}

Stay in character. Be thorough and specific.`;

  if (CONFIG.provider === "anthropic") {
    const response = await client.messages.create({
      model: CONFIG.anthropic.model,
      max_tokens: CONFIG.maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });
    // Extract text from response, handling different content block types
    const textBlocks = response.content.filter((block) => block.type === "text");
    if (textBlocks.length === 0) {
      throw new Error(`No text in response. Got: ${JSON.stringify(response.content.map(b => b.type))}`);
    }
    return textBlocks.map((b) => b.text).join("\n");
  } else {
    const response = await client.chat.completions.create({
      model: CONFIG.openai.model,
      max_tokens: CONFIG.maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    return response.choices[0].message.content;
  }
}

/**
 * Call LLM with web search capability (Anthropic only)
 * Uses an agentic loop to handle tool calls
 */
async function callLLMWithSearch(client, agent, prompt, verbose = true) {
  const systemPrompt = `You are ${agent.name}, a ${agent.role}.

Your goal: ${agent.goal}

Background: ${agent.background}

Stay in character. Be thorough and specific.

You have access to web search. Use it to find information, verify facts, and discover obscure sources.
Search multiple times with different queries to get comprehensive results.`;

  if (CONFIG.provider !== "anthropic") {
    // Fall back to simple call for OpenAI (no native web search)
    console.log("  (Web search only available with Anthropic, skipping...)");
    return callLLMSimple(client, agent, prompt);
  }

  // Anthropic's server-side web search tool
  const tools = [
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 20,
    },
  ];

  let messages = [{ role: "user", content: prompt }];
  let searchCount = 0;

  // Agentic loop - keep going until model stops using tools
  while (true) {
    const response = await client.messages.create({
      model: CONFIG.anthropic.model,
      max_tokens: CONFIG.maxTokens,
      system: systemPrompt,
      tools: tools,
      messages: messages,
    });

    // Check if we're done (no more tool use)
    if (response.stop_reason === "end_turn") {
      // Extract final text response
      const textBlocks = response.content.filter(
        (block) => block.type === "text"
      );
      return textBlocks.map((b) => b.text).join("\n");
    }

    // Process tool uses
    const toolUseBlocks = response.content.filter(
      (block) => block.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) {
      // No tool use and not end_turn - extract whatever text we have
      const textBlocks = response.content.filter(
        (block) => block.type === "text"
      );
      return textBlocks.map((b) => b.text).join("\n");
    }

    // Add assistant's response to messages
    messages.push({ role: "assistant", content: response.content });

    // Process each tool use - for web_search, Anthropic handles it server-side
    // We just need to continue the conversation
    const toolResults = [];
    for (const toolUse of toolUseBlocks) {
      if (toolUse.name === "web_search") {
        searchCount++;
        if (verbose) {
          console.log(`  [Web Search #${searchCount}]: ${toolUse.input.query}`);
        }
        // Anthropic's web_search is server-side, results come back automatically
        // We don't need to provide tool_result for server-side tools
      }
    }

    // For server-side tools like web_search, we don't add tool_result messages
    // The API handles the search and includes results in the next response
    // Just continue the loop - the next API call will have search results
  }
}

/**
 * Main LLM call function - routes to appropriate handler
 */
async function callLLM(client, agent, prompt, useWebSearch = false, verbose = true) {
  if (useWebSearch) {
    return callLLMWithSearch(client, agent, prompt, verbose);
  }
  return callLLMSimple(client, agent, prompt);
}

// ============================================
// TEAM RUNNER
// ============================================

async function runTeam(inputs, options = {}) {
  const { verbose = true, onTaskStart, onTaskComplete } = options;
  const client = createClient();
  const results = {};

  console.log(`\n${"=".repeat(60)}`);
  console.log(`RABBIT HOLE ESSAY SQUADRON`);
  console.log(`Provider: ${CONFIG.provider.toUpperCase()}`);
  console.log(`Topic: ${inputs.topic}`);
  console.log(`${"=".repeat(60)}\n`);

  for (const task of tasks) {
    const agent = agents[task.agent];
    const taskPrompt = task.description(inputs, results);

    if (verbose) {
      console.log(`\n[${"=".repeat(20)}]`);
      console.log(`TASK: ${task.id.toUpperCase()}`);
      console.log(`AGENT: ${agent.name} (${agent.role})`);
      console.log(`[${"=".repeat(20)}]\n`);
    }

    if (onTaskStart) {
      onTaskStart(task, agent);
    }

    const startTime = Date.now();
    const useSearch = task.useWebSearch || false;
    if (useSearch && verbose) {
      console.log(`Web search: ENABLED`);
    }
    const result = await callLLM(client, agent, taskPrompt, useSearch, verbose);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    results[task.id] = result;

    if (verbose) {
      console.log(`Completed in ${elapsed}s`);
      console.log(`Output length: ${result.length} chars`);
    }

    if (onTaskComplete) {
      onTaskComplete(task, agent, result, elapsed);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`ALL TASKS COMPLETE`);
  console.log(`${"=".repeat(60)}\n`);

  return results;
}

// ============================================
// CLI ENTRY POINT
// ============================================

async function main() {
  const topic =
    process.argv[2] ||
    "The intersection of Banksy and punk music, through a philosophical lens.";

  try {
    const results = await runTeam({ topic });

    // Save outputs
    const fs = await import("fs/promises");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputDir = `./output-${timestamp}`;

    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(`${outputDir}/1-research.md`, results.research);
    await fs.writeFile(`${outputDir}/2-narrative.md`, results.connect);
    await fs.writeFile(`${outputDir}/3-essay.md`, results.write);
    await fs.writeFile(`${outputDir}/4-factcheck.md`, results.factcheck);
    await fs.writeFile(`${outputDir}/5-visuals.md`, results.visuals);

    console.log(`\nOutputs saved to: ${outputDir}/`);
  } catch (error) {
    console.error("Error running team:", error.message);
    process.exit(1);
  }
}

// Run if called directly
main();

// Export for use as module
export { agents, tasks, runTeam, CONFIG };
