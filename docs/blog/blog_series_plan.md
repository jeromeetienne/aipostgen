# Blog series plan: aipostgen

A three-part series about aipostgen.

- **Target:** two readers at once. Hiring managers reading it as a portfolio,
  and users who might pick up the tool. Post 1 leans toward users; posts 2 and 3
  lean toward hiring managers and technical peers; all three are written so
  either reader gets value.
- **Goal:** demonstrate skill in designing reliable AI systems.
- **Shape:** three posts, each able to stand alone.

## Style and tone

These apply to all three posts unless a post says otherwise.

- **Length:** medium, roughly 900 to 1200 words each (a five to six minute read).
- **Tone:** opinionated and bold about the ideas. Take clear stances and name the
  trade-offs others avoid.
- **Persona:** first person and humble about myself. Clear ownership ("I chose",
  "I learned") paired with visible self-critique. Bold about the work, modest
  about the author.
- **Visuals:** prose-first and minimal. Words carry the posts. At most one
  diagram, in post 2. No code-heavy sections.
- **Titles:** provocative and claim-led (for example "Keep the state machine out
  of the LLM"). The title makes a claim the post then earns.
- **Voice:** a fresh long-form blog voice, written for these posts. Do not reuse
  the social-post voice from `.aipostgen/style_guide.md`; that one is tuned for
  short posts.
- **Endings:** close with the GitHub link and a low-key invitation to try it or
  read the code. No hard sell.
- **Avoid:**
  - AI-tell phrases ("delve", "in today's fast-paced world", "it is not just X,
    it is Y", "unlock", "leverage").
  - Em-dashes. Use commas, colons, or full stops instead.
  - Hype and superlatives ("revolutionary", "game-changing", "seamless").
  - Heavy jargon. Keep terms like agent and language model, but explain each once
    and do not assume deep familiarity.

## The arc

A deliberate zoom-out. Each post pulls the camera back one step.

**Post 1 — what it does** (the user's eye) → **Post 2 — how it is built**
(the engineer's eye) → **Post 3 — what it teaches** (the designer's eye,
generalizable).

The through-line that ties all three: **reliable AI tools come from putting
determinism and non-determinism in the right places.** Post 1 shows the calm
result, post 2 shows the machinery, post 3 names the principle.

A note on audience: the reader is a hiring manager, but post 1 is written for
users. That is deliberate. A hiring manager reading a clean user-facing post
learns that the author thinks about the user first. All three posts are written
with the hiring manager reading over the shoulder, even when the stated audience
differs.

## Post 1 — "Meet aipostgen: consistent social posts without the dread"

Stated audience: users. Real signal to a hiring manager: the work starts from a
real problem and a clear user experience.

- **The pain.** Posting the same idea to X, Bluesky, and LinkedIn means three
  rewrites, three sets of limits, three voices, so most people simply do not.
  Open on that friction.
- **The experience.** Walk one real run end to end: a URL goes in, it shows the
  angle and waits, an image, three drafts in your voice, you approve or edit,
  paste-ready text. Screenshots, not architecture.
- **The two moments of control.** Highlight the two gates: approve the angle
  early, approve the drafts at the end. Frame: the machine does the typing, you
  keep the judgment.
- **Honest boundary.** It hands you paste-ready text; you do the final copy and
  paste. Say so. Restraint reads as maturity.
- **Close.** One line that plants the hook for post 2: the interesting part is
  what is not left to the AI.

Why it lands for hiring: demonstrates user empathy, scoping, and the confidence
to ship something narrow and finished.

## Post 2 — "How aipostgen is built: a small deterministic spine, a creative core"

Audience: technical peers and hiring managers. This is the design showcase.

- **The shape.** Four phases (research, write, review, done), two gates, a
  rewrite loop bounded to two tries. The diagram from the README.
- **The split that matters.** Control flow lives in a plain TypeScript
  command-line tool that owns `state.json`; Claude does only the creative work.
  Introduce it here as fact; post 3 argues why.
- **Orchestrator and subagents.** The `/aipostgen` skill orchestrates; `research`
  and `review` are separate agents with narrow jobs. Why separation of concerns
  matters with language models as much as with code.
- **Voice and the quality bar.** The style guide and quality bar are
  plain-markdown files the user edits, and the bar is calibrated so the user's
  own real posts pass it. A sharp, concrete design decision; give it room.
- **What I would do differently.** One or two honest trade-offs (for example the
  `gray-matter` dependency gap, or the cost of on-disk state). Self-critique
  signals seniority.

Why it lands for hiring: shows explicit, defensible architectural choices and the
ability to explain them.

## Post 3 — "Keep the state machine out of the LLM"

Audience: anyone building agentic tools. The transferable lesson, and the
strongest portfolio piece.

- **The trap.** The tempting design is "let the agent decide what to do next." It
  demos beautifully and fails quietly: skipped steps, re-run gates,
  non-reproducible runs.
- **The principle.** Determinism where you need guarantees (phase order, the
  gates, the bounded rewrite loop), non-determinism where you want creativity
  (research, writing). The command-line tool is the guarantee; the language model
  is the talent.
- **The payoff.** Reproducible runs, debuggable state you can read on disk, gates
  that cannot be skipped because code enforces them rather than a prompt asking
  nicely.
- **Generalize.** This is not about social posts. It is a pattern for any agentic
  system: a deterministic spine around a non-deterministic core. Name when you
  would reach for it and when you would not.
- **Close.** Tie back: the calm experience in post 1 exists because of this
  choice in post 3.

Why it lands for hiring: this is the post that says "I do not just use language
models, I know where to trust them," which is exactly what an AI design hire is
judged on.

## Deliberate choices

- Post 1 is kept free of architecture. Mixing levels is the most common way an
  intro post loses its users.
- The "what" and the "why" of the state-machine idea are split across posts 2 and
  3 on purpose, so post 3 has a real argument to make rather than repeating
  post 2.

## Source material

- `README.md` — the four-phase flow and the diagram.
- `docs/ADRs/0001_four_phase_pipeline_with_gates.md` — the gates (post 1 and 3).
- `docs/ADRs/0003_control_flow_in_command_line_tool.md` — the state-machine
  split (post 2 and 3).
- `docs/ADRs/0004_orchestrator_skill_and_subagents.md` — orchestrator and
  subagents (post 2).
- `.aipostgen/quality_bar.md` and `.aipostgen/style_guide.md` — voice and the
  quality bar (post 2).
