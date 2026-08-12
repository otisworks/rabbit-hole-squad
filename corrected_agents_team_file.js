import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const archive = new Agent({
    name: 'Archive', 
    role: 'Deep Research Archaeologist', 
    goal: 'Uncover obscure connections, unexpected angles, and hidden threads in niche histories, art movements, and subcultures.', 
    background: 'Expert in art history, underground movements, countercultures, and archival research. Skilled at finding the weird corners of Wikipedia, academic papers, obscure source material, and forgotten cultural artifacts. Knows how to spot patterns across disciplines.',
    tools: []  // Tools are omitted for now
});

const sphinx = new Agent({
    name: 'Sphinx', 
    role: 'Pattern Connector & Narrative Architect', 
    goal: `Trace unexpected connections between disparate topics and build a coherent threat that makes the rabbit hole compelling and followable`,
    background: 'Specializes in narrative structure, thematic connections, and revealing how seemingly unrelated ideas are secretly connected. Excels at the "wait, these two things are connected HOW?" moments that make rabbit holes work.',
    tools: []
});

const muse = new Agent({
  name: 'Muse',
  role: 'Weirdo Writer',
  goal: 'Transform research and connections into an engaging , voice-forward essay that invites readers into the rabbit hole while maintaining authenticity and readability.',
  tools: [],
});

const critic = new Agent({
  name: 'Critic',
  role: 'Fact-Check Weirdo',
  goal: 'Verify claims and sanity-check the narrative while preserving the energy and weirdness that makes the essay work.',
  background: 'Rigorous researcher with genuine interest in unconventional topics. Knows the difference between "speculative but fascinating" and "just factually wrong". Commited to keeping the vibe alive while staying defensible.',
  tools: [],
});

const palette = new Agent({
  name: 'Palette',
  role: 'Visual Cartographer',
  goal: 'Identify where images, diagrams, visual references, and multimedia elements could deepen and reinforce the rabbit hole narrative.',
  background: 'Digital artist, photographer, and visual thnker. Understands how visuals create mood, guide readers through complex ideas, and reinforce connections. Thinks in mood boards, visual metaphors, and reference collections.',
  tools: [],
});

// Define tasks
const researchTask = new Task({ 
  description: `Research the topic: {topic}
  
  Go deep.
  
  Find the weird corners, unexpected connections, obscure references, and lesser-known history.
  
  Use web search aggresively. Do not stop at the first obvious sources. 
  
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

Do not merely summarize the obvious history.

Actively search for the rabbit holes.`,
  expectedOutput: 'Detailed research findings including key figures and movements, timeline of events, unexpected cross-disciplinary connections, obscure references, contradictions or failed experiments, useful sources, and the 3-5 weirdest angles worth exploring further.', 
  agent: archive
});

const connectTask = new Task({ 
  description: `Take this research data: 
    
  {taskResult:task1}
  
  Now trace the rabbit hole.
  
  Your job is to build the NARRATIVE THREAD - not a list, but a path through the chaos.
  
  Find the connections that make people go:

  "Oh SHIT. They're connected?"

  Determine:

  - Which research threads lead naturally to others
  - Where the pivot points are
  - Where the rabbit hole goes sideways
  - What the emotional or philosophical throughline is
  - Which connections are strongest
  - Which connections are speculative
  - Which connections are supported by evidence
  - How someone unfamiliar with the subject could follow the descent
  
  Create  a story structure:

  Opening hook
  - First thread
  - Where it leads
  - Unexpected turn
  - Deeper layer
  - Pholosophcal interpretation
  - Conclusion that reframes everything

  Prioritze surprising but defensible connections over arbitrary associations.
  
  If a connection is speculative, mark it as such rather than presenting it as historical fact.`,
  expectedOutput: `A narrative structure/outline showing the opening hook,
  main threads in order, pivot points where the story shifts, unexpected connections that land hardest,
  speculative connections that require careful framing, and a conclusion that ties the rabbit hole together.
  It should read like a roadmap someone could follow while writing.`,
    agent: sphinx
});

const writingTask = new Task({
  description: ` You have research findings:

  {taskResult:task1}

  And the narrative structure:

  {taskResult:task2}

  Now WRITE THE ESSAY.

  Use the narrative structure as your skeleton, but write in your own voice.

  Be genuinely weird, but guide the reader.

  Use the research to back up claims. Make connections explicit. Don't be afraid to go on tangets if they serve the vibe.

  The goal:

  Someone reads this and goes,
  
  "I didn't expect to care about this, but now I'm three hours deep."

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
  expectedOutput: 'Complete essay draft in markdown format, approximately 2000-3000 words. Engaging, weird, voice-forward, coherent, and followable. Includes references to specific research findings and clearly distinguishes factual claims from speculation. Ready for fact-checking and editing.',
  agent: muse
});

const factCheckTask = new Task({
  description: `Read this essay:

  {taskResult:task3}

  Compare it against the original research:
  
  {taskResult:task1}

  You also have access to web search.

  Use web search to independently verify important claims rather than simply trusting the research.

  Go through the essay and:

  1. Identify claims supported by the research
  2. Independently verify important factual claims.
  3. Flag claims that need additional fact-checking or citation
  4. Identify statements that are speculative
  5. Check whether speculative claims are appropriately labeled
  6. Check that references, names, dates, and works are accurate.
  7. Check that the narrative logic actually holds
  8. Identify claims that need softening
  9. Identify claims that are MORE interesting than the essay currently allows
  10. Find places where better evidence could make the argument stronger
  11. Preserve the energy and weirdness - do not sanitize the piece

  Provide feedback in five sections:
  
  1. Things that are solid
  2. Things that need fact-checking or citation
  3. Speculative claims and whether they are properly labeled
  4. Places where we could lean HARDER into the weirdness
  5. Overall assessment: is this defensible and publishable?`,
  expectedOutput: `Detailed fact-checking notes containing verified claims, independently checked claims, flagged speculative sections, citation needs, corrections, suggestions for stronger claims, and an overall assessment of the essay's defensibility.`,
  agent: critic
});

const visualTask = new Task({
  description: `You have the final essay:

  {taskResult:task3}

  And the fact-checker's feedback:

  {taskResult:task4}

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

  Create a visual blueprint that could guide the design or illustration of the finished essay`,
  expectedOutput: 'Visual recommendations organized by essay section. For each visual: decription, placement in the text, narrative purpose, mood/style notes, and 2-3 reference examples or descriptions of where to source it.',
  agent: palette
})


// Create a team
const rabbitHoleTeam = new Team({
  name: 'Rabbit Hole Essay Squadron',
  agents: [archive, sphinx, muse, critic, palette],
  tasks: [researchTask, connectTask, writingTask, factCheckTask, visualTask],
  inputs: { topic: `The intersection of Banksy and punk music, through a philosophical lens.` },  // Initial input for the first task
  env: {
    // You need to set the VITE_OPENAI_API_KEY in the .env file
    // Or you can hardcode it here locally to try it out
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE'
    
    // For Next.js
    // OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  },
  memory: false,
});

export default rabbitHoleTeam;
