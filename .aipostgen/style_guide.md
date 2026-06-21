# Style Guide

This file tells aipostgen how your posts should sound. The writing step reads it
before it drafts, and the review step checks drafts against it. Edit it freely —
your changes apply on the next run.

> Drafted from your Bluesky posts (@jerome-etienne.bsky.social). Correct anything
> that is off — especially the lines marked **[check]**.

---

## Who I am
Solo developer building AI-powered developer tools in public — codespine /
ts-knowledge-graph and related. Tags self as #soloPreneur; also posts as
contentMagick.ai. A builder who ships and shows the receipts.

## Who I am writing for, and why
Developers, TypeScript developers especially. Goal: build in public, show what
the tools actually do with real results, and drive readers to the GitHub repository.

## Tone
Confident, punchy, results-first. Short declarative sentences and fragments.
Bold claims, always backed by hard numbers. A bit of swagger — "This thing is
scary good." — but never hype without proof. Provocative when it earns the
attention: "Your README lies. Your code doesn't."

## Typical shape
Hook line → blank line → the result with hard numbers and an emoji → optional
one-line reaction → blank line → GitHub link → hashtags → a visual (results
table, chart, or graphic). Almost every post carries an image.

## Always do
- Lead with a result or a provocative claim — never a warm-up.
- Back every claim with concrete numbers (3× faster, -97.6%, 0 repeat requests).
- Use arrows for before/after (serial awaits → Promise.all; source → PDF).
- Attach a visual.
- Link to the GitHub repository.

## Never do
- No corporate warm-ups ("thrilled to announce", "I want to talk about").
- No vague claims with no number behind them.
- No walls of text — keep beats separated by blank lines.

## Emoji
Sparing — about one per beat, as punctuation on a punchy line. Seen in your
posts: 🚀 (a launch), 🤯 (after a big number), 😎 (a cool result), 👇 (pointing
to a link or image). Roughly one to three per post.

## Unicode-font trick
**[check]** Not visible in the posts you shared. Do you use the 𝗯𝗼𝗹𝗱 / 𝘪𝘵𝘢𝘭𝘪𝘤
unicode trick, and where? Left blank until you confirm.

## Tags, mentions, sign-off
Always **#buildInPublic**, plus an AI tag and an optimization tag.
**[check]** Your capitalization varies in the wild — #ai / #AI / #Ai, and
#optim / #OptimByAI. Pick the canonical form and I will lock it in.
Suggested default: `#AI #buildInPublic #OptimByAI`.

## Per-platform voice
Only the tone differences here — length and format live in platform_specs.md.
- **Bluesky:** punchy, numbers, a visual, the repo link, two or three hashtags.
- **X:** **[check]** no examples yet — same voice, or different?
- **LinkedIn:** **[check]** no examples yet — same, or more long-form and explanatory?

## Example posts
Exact post text from bsky_client, as voice reference for the writer. The first
group is your strong, representative posts; the second is your lighter, casual
posts — quality_bar uses a lighter bar (the `casual` post type) for those.

1. 🚀 codespine turns your TypeScript into a queryable graph — who-calls, blast-radius, dead code, hotspots.

   It found 3 serial API calls → 3× faster, 0 repeat requests 🤯

   github.com/jeromeetienne/…

   #ai #buildInPublic #optim

2. Pointed CodeSpine at a small web server with SQL endpoints.

   -61% / -97.6% / -99.7% latency cuts across 4 routes 🤯

   This thing is scary good.

   github.com/jeromeetienne/…

   #ai #buildInPublic #optim

3. Your README lies. Your code doesn't. Optimize your code via #AI

   ts-knowledge-graph turns any TypeScript repo into a one-page Codebase Brief: what's load-bearing, where runtime really goes, what's dead code.

   Straight from source → PDF. 👇

   #buildInPublic

   github.com/jeromeetienne/…

4. Better and more accurate profiling and resource throttling! Unified for all OS thank to Docker! 😎

   #Ai #buildInPublic #OptimByAI

   jeromeetienne.github.io/ts_knowledge…

5. Biggest challenge: reproducibility 🤯

   Local env = great for hacking, terrible for benchmarking. Different numbers every run.

   Fix: Docker resource constraints — pinned CPUs, locked memory → stable results 🚀

### Casual posts (lighter register)

6. one tool to rule them all! 🔥👍

7. Having fun with optimisation by #AI - Just the visualisation for now 😀 #buildInPublic
