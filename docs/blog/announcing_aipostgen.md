# Your AI Should Draft. You Should Decide.

You can smell an AI-generated post from across the timeline. Same shape, same cadence, same three bullet points and a closing question that nobody actually wants answered. The problem was never that a machine helped write it. Writing is hard, blank pages are worse, and a good first draft from a good model is a real gift. The problem is the machine that *posts* it — on autopilot, in nobody's voice, with no one home to say "no, not like that."

That is the trade most tools quietly make. They promise to take social media off your plate, and the way they do it is by taking your judgment off the plate too. You wake up to a feed full of content that is technically yours and recognizably no one's.

So I built the opposite of that. It is called **aipostgen**, and it refuses to hit publish.

## What it is

aipostgen turns a URL, a public repository, or a few words into review-ready social posts for **X**, **Bluesky**, and **LinkedIn**. It researches the material, writes one draft per platform in your voice, reviews each draft against a quality bar, and hands you paste-ready text — the post, the image to attach, and, for LinkedIn, the link to drop in the first comment. Then it stops. You do the final copy and paste.

By default it writes for all three platforms. Name a subset if you want fewer. Every run is saved under its own directory, so you can go back, re-read, and reuse.

It is not a scheduler, a growth hack, or a bot farm. It is a drafting partner that knows where its job ends.

## Human-in-the-loop, on purpose

Most of these tools optimize for "fire and forget." aipostgen optimizes for the two moments where your judgment actually changes the outcome, and it stops dead at both:

- **The angle.** Before it writes a single sentence of the post, it shows you the angle it found — the story it thinks is worth telling — and asks if that is right. You approve it or steer it. This is the cheapest possible place to catch a post that is about to be subtly wrong, because nothing has been written yet. Steering the angle costs a sentence; rewriting three finished drafts costs an afternoon.
- **The drafts.** Before anything becomes paste-ready, it shows you the finished drafts for every platform. You approve them, or edit any one by hand.

AI drafts. You decide. There is no third gate where it quietly publishes behind your back, because there is no publish step at all — that part is deferred on purpose, and I will come back to why.

Two gates is not an accident of the implementation. It is the thesis. Enough automation that you are not staring at a blank page, enough friction that nothing goes out in your name without you reading it first.

## Your voice, not generic AI

Here is the real reason most AI posts sound the same: they are calibrated against the average internet. The model reaches for the most likely sentence, and the most likely sentence is, by definition, the most average one. You end up sounding like everyone.

aipostgen is calibrated against *you*. Three plain-markdown files do the work, and you own all of them:

- `style_guide.md` — how your posts sound: persona, tone, emoji, tags, and per-platform voice. The same thought lands differently on LinkedIn than it does on X, and this file knows the difference.
- `quality_bar.md` — what counts as good enough: the blocking checks that must pass and the advisory ones that merely nudge.
- `platform_specs.md` — the length and format limits for each platform, so a draft is never over the line.

The trick is in the calibration. The quality bar is tuned so that **your own real posts pass it.** Not a generic "is this engaging" rubric — your actual published work, used as the reference for what good looks like. Edit any of these files and your changes apply on the very next run. The tool bends to your voice; you do not bend to the tool's.

## How it works

A run moves through four phases, with the two gates sitting between them:

```
research → ✋ confirm angle → write → review ⤿ rewrite → ✋ approve → 📋 paste-ready
```

**Research** reads the input and writes a research bundle: the angle, the claims paired with their sources, and a brief for the image. Claims carry their sources so a post never asserts something the material does not support.

**Write** turns that bundle into one draft per platform, in your voice and inside each platform's limits.

**Review** judges every draft against the quality bar and loops a rewrite at most twice. The cap matters: a review loop with no limit is just a slower way to waste tokens. Anything that already passes is left untouched — the tool does not rewrite good work for the sake of looking busy.

Then you get **paste-ready** output: the text per platform, the generated image, and the LinkedIn first-comment link.

There is also a fast path. When the input is just plain text — a quick thought you want to post — the run skips research and the angle gate and goes straight to writing. The draft is still reviewed against the bar. Speed where the input is simple, rigor where it is not.

## The design choice that makes it boring (in a good way)

The control flow lives in a small, deterministic TypeScript state machine. It owns the run state, enforces the phase order, runs the rewrite loop, counts the rewrites so the loop terminates, and guards the two gates. It is a plain command-line tool reading and writing a `state.json` file, and it reports exactly one thing: the next action.

Claude does the creative work — the research, the writing, the review — and *only* the creative work. It never decides what happens next in the run. That decision belongs to the state machine, every time.

That split is the entire point: **determinism where you want order, judgment where you want a mind.** The workflow is never improvised, so a run cannot skip a gate, post twice, or wander off. And the prose is never mechanical, because a model wrote it, not a template. The boring, predictable part is boring on purpose; it is what lets the creative part be trusted.

The design decisions are written down as architecture decision records in the repository, including the one that explains why publishing is deferred rather than built.

## Try it

It is MIT-licensed and runs on top of Claude Code. You need Node.js 18 or later.

```sh
git clone https://github.com/jeromeetienne/aipostgen.git
cd aipostgen
npm install
```

Then, in Claude Code:

```
/aipostgen https://example.com/the-article      a URL
/aipostgen /path/to/a/repository                 a public repository
/aipostgen "a quick thought I want to post"      plain text
```

Publishing is deliberately left to you, for now — browser posting to X and LinkedIn, and Bluesky through its client, is on the roadmap. Until then, the last step is yours by design. The drafts are yours, in your voice, and nothing goes out until you say so.

That is the whole idea. Let the machine do the part that is hard to start. Keep the part that is yours.
