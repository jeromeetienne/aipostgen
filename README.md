# aipostgen

Generate review-ready social posts for **X**, **Bluesky**, and **LinkedIn** from a URL, a public repository, or a few words — driven by [Claude Code](https://claude.com/claude-code).

aipostgen researches the material, writes a draft for each platform in your own voice, reviews each one against a quality bar, and stops at two human gates so you stay in control. It hands you paste-ready text; you do the final copy and paste.

## How it works

A run moves through four phases, with two points where it stops for your decision:

```
research → ✋ confirm angle → assets → write → review ⤿ rewrite → ✋ approve → 📋 paste-ready
```

- **Research** reads the input and writes a research bundle: the angle, the claims with their sources, and a brief for the image.
- **Write** turns the bundle into one draft per platform, in your voice and within each platform's limits.
- **Review** judges each draft against the quality bar and loops a rewrite at most twice; platforms that pass are left untouched.
- You approve the angle early, and the finished drafts at the end.

The control flow lives in a small TypeScript command-line tool that owns the run state; the creative work is done by Claude. The design decisions are recorded in [docs/ADRs/](docs/ADRs/README.md).

## Install

Requirements: **Node.js 18 or later** and **Claude Code**.

```sh
git clone https://github.com/jeromeetienne/aipostgen.git
cd aipostgen
npm install
```

The `/aipostgen` skill and the `research` and `review` agents live in `.claude/`. Open the project in Claude Code; the skill and the agents register when Claude Code starts.

## Use

In Claude Code, run the skill with your input:

```
/aipostgen https://example.com/the-article      a URL
/aipostgen /path/to/a/repository                 a public repository
/aipostgen "a quick thought I want to post"      plain text
```

By default it writes for all three platforms; name a subset if you want fewer.

What happens:

1. It researches the input and shows you the **angle**. You approve it or steer it.
2. It generates an image from the brief and shows it to you.
3. It writes a draft per platform and runs the review pass.
4. It shows you the **finished drafts**. You approve them, or edit any one.
5. It prints **paste-ready** text for each platform, plus the image to attach and, for LinkedIn, the link to place in the first comment.

Each run is saved under `posts/<date>_<slug>/`.

### Plain text is a fast path

When the input is plain text, the run skips research and the angle gate and goes straight to writing — but the draft is still reviewed.

## Configure

Three plain-markdown files in `.aipostgen/` decide how your posts come out. Edit them freely; your changes apply on the next run.

| File | What it controls |
|---|---|
| `style_guide.md` | How your posts sound — persona, tone, emoji, tags, per-platform voice |
| `quality_bar.md` | What counts as good enough — the blocking and advisory checks |
| `platform_specs.md` | Length and format limits per platform |

The quality bar is calibrated so that your own real posts pass it.

## Project layout

```
.aipostgen/            reference files you edit (style_guide, quality_bar, platform_specs)
.claude/
  skills/aipostgen/    the /aipostgen orchestrator skill
  agents/              the research and review agents
src/
  cli.ts               the command-line entry point
  libs/                run-state schema, state machine, and store
docs/ADRs/              architecture decision records
posts/                 one directory per run (not tracked by git)
```

A run directory holds `state.json` (the run's phase and per-platform status), `research_bundle.md`, `drafts/`, `assets/`, and `review.json`.

## The command-line tool

You do not normally call it directly — the skill does — but it is a plain command-line tool:

```sh
npx tsx src/cli.ts <command> [options]
```

Commands include `start`, `status`, `next`, `set-research`, `approve-angle`, `mark-drafted`, `record-review`, `approve-draft`, and `list`. The tool reads and writes `state.json` and reports the next action, which keeps the phase order, the rewrite loop, and the gates deterministic.

## Status

- **Working:** research, writing, review, both human gates, and paste-ready output.
- **Deferred:** publishing. For now you copy and paste the output yourself. Posting to X and LinkedIn through a browser, and to Bluesky through its client, is planned (see ADR-0001).

## License

Released under the [MIT License](LICENSE).
