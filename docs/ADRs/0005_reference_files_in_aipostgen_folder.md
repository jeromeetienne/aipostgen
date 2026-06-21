# ADR-0005: User-editable reference files in .aipostgen/, separate from the machinery

**Status:** Accepted
**Date:** 2026-06-21
**Deciders:** Jerome Etienne

## Context
The quality of a post depends on knowledge that is personal and changes over time: the author's voice, what counts as good enough, and each platform's limits. This knowledge must be easy for the user to read and edit without touching code, and it must be the single source of truth for both writing and review.

## Decision
Keep three markdown files in `.aipostgen/`: `style_guide.md` (how the posts sound), `quality_bar.md` (what counts as good enough), and `platform_specs.md` (length and format per platform). The writing step and the review agent read them. They sit apart from the `.claude/` machinery and the `src/` code.

## Options Considered

### Option A: Editable markdown in .aipostgen/ (chosen)
| Dimension | Assessment |
|---|---|
| User editability | High — plain markdown |
| Readability of prose, such as voice | High |
| Single source of truth | Yes — read by writing and review |

**Pros:** the user owns the craft and can change it between runs; markdown suits prose such as the voice; the rules are calibrated against the user's real posts.
**Cons:** prose rules are applied by judgment rather than parsed strictly.

### Option B: Bake the rules into the skill and agent prompts
**Pros:** nothing extra to load.
**Cons:** not user-editable; the craft is buried in the machinery.

### Option C: A structured format such as JSON or YAML
**Pros:** machine-parseable.
**Cons:** poor for prose such as the voice description and worked examples; harder for the user to edit by hand.

## Trade-off Analysis
The craft — voice, the quality bar, platform norms — is the part that decides whether a post is good, and it is personal. Plain, editable markdown puts it in the user's hands and keeps it readable. The reference files then become the source that an agent definition is built from, rather than rules baked into code.

## Consequences
- Easier: the user tunes the voice and the quality bar without changing code; the bar is calibrated against real posts.
- Harder: prose rules rely on the reviewer's judgment, which is why the quality bar carries worked examples.
- Revisit: add further reference files, such as a per-platform voice file, if needed.

## Action Items
1. [x] Write style_guide, quality_bar, and platform_specs, calibrated against real posts.
2. [ ] Resolve the open items in style_guide: the unicode-font trick, the canonical hashtags, and the X and LinkedIn voice.
