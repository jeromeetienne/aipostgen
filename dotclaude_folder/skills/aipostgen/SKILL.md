---
name: aipostgen
description: Generate review-ready social posts for X, Bluesky, and LinkedIn from a URL, a public repository, or a few words. It runs research, writing, and review, stops at two approval gates, and hands back paste-ready text. Use when the user wants to create a social post, or runs /aipostgen.
---

# aipostgen

You orchestrate one social post run. The control flow lives in a command-line tool —
you do the creative work and run the human gates. Never decide the phase yourself; ask
the tool.

## The tool

Run the tool with:

	npx aipostgen <command> [options]

`npx` resolves the `aipostgen` binary, so the command works from any working
directory, even after an asset step has changed directories. It reads and
writes `state.json` in the run directory and reports the next action.

## Reference files

- `.aipostgen/style_guide.md` — how the posts must sound. Read it before writing.
- `.aipostgen/platform_specs.md` — length and format limits per platform. Read it before writing.
- `.aipostgen/quality_bar.md` — what counts as good enough. The Review agent reads it.

## Start a run

1. Pass the user's input through as the entry value. Choose whether it needs research:
   use `--research` (the default) for a URL, a repository, or a topic to look into; use
   `--fast` for a quick post from a few words that can skip straight to drafting.
2. Choose a provisional slug in snake_case, from the title or the text.
3. Default to all three platforms unless the user named a subset.
4. Run:

	npx aipostgen start --value "<value>" --research --slug <slug> --platforms x,bsky,linkedin

   Swap `--research` for `--fast` to skip research.

Keep the printed `dir`; every later command needs `--dir <dir>`.

If the skill was invoked with no input, run `list` first. If a run is in progress,
offer to continue it.

## Auto mode

If the user's input carries a phrase that asks the run to proceed without stopping —
for example "full auto", "don't ask me questions", "no questions", or "just do it" —
run the whole loop without pausing at either gate. Strip that phrase from the entry
value before you choose the kind and slug, so it never becomes part of the material.

In auto mode the two gates become non-interactive: at `await_angle` you approve the
angle yourself, and at `await_approval` you approve every draft yourself, using the
same tool commands. Everything else is unchanged — research, writing, the review pass,
and its rewrite loop all still run. The steps below note what each gate does in auto mode.

## The loop

Repeat until the action is `done`:

1. Ask what is next:

	npx aipostgen next --dir <dir>

2. Perform the action below.
3. Record the result with the matching command.

### research
Spawn the `research` agent with the entry value and the run `dir`. It writes
`<dir>/research_bundle.md` and returns the post type. Then:

	npx aipostgen set-research --dir <dir> --post-type <result|capability|opinion|casual>

### await_angle — gate one
Show the user the angle and the asset brief from `research_bundle.md`.
- Approved: `approve-angle --dir <dir>`, then rename to a final slug:
  `rename --dir <dir> --slug <final_slug>` and keep the new dir it prints.
- Redirect: tell the `research` agent what to change, then `redirect-angle --dir <dir>`.

In auto mode, do not stop for approval: approve the angle yourself with
`approve-angle --dir <dir>`, then rename as above.

### assets
Read the asset brief in `research_bundle.md`. If a visual is wanted, generate or
collect it into `<dir>/assets/` as a PNG file (`.png`), show it to the user, and let
them keep it, regenerate it, or supply their own. Whatever the source, the saved asset
must be a `.png`; convert it if it arrives in another format. When settled, or if no
visual is wanted:

	npx aipostgen after-assets --dir <dir>

In auto mode, keep the generated asset without pausing, then run `after-assets`.

### write [platforms]
Read `style_guide.md` and `platform_specs.md`. For each platform listed, write the
draft to `<dir>/drafts/<platform>.md` — on voice, within the platform limit, with the
asset and its alt text noted. After each draft:

	npx aipostgen mark-drafted --dir <dir> --platform <platform>

### review [platforms]
For each platform listed, spawn the `review` agent with the run `dir` and the platform.
It reads `research_bundle.md`, the draft, `quality_bar.md`, and the previous
`<dir>/review.json`, writes `review.json`, and returns a verdict. Record each:

	npx aipostgen record-review --dir <dir> --platform <platform> --verdict <pass|revise>

A `revise` sends only that platform back to `write`, up to the cap. When a platform
reaches the cap unresolved, the tool routes it to you at the approval gate.

### await_approval [platforms] — gate two
Show the user the finished drafts in the paste-ready form below. For each:
- Approved: `approve-draft --dir <dir> --platform <platform>`.
- Edited: save the user's text to `<dir>/drafts/<platform>.md`, then
  `edit-draft --dir <dir> --platform <platform>`, which re-runs review on the edit.

In auto mode, do not stop for approval: approve every platform yourself with
`approve-draft --dir <dir> --platform <platform>`.

### done
Produce the paste-ready output and stop.

## Paste-ready output

For each platform, print one block the user can copy:
- the post text;
- the asset to attach, with its alt text;
- for LinkedIn, the link to place in the first comment, and a reminder to do so.

## Fast path

With `--fast`, the tool starts at `write` — no research and no angle gate — but the
draft still goes through review. Use it when the input is a few words that can skip
straight to drafting. Otherwise use `--research`.
