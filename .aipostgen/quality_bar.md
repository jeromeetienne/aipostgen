# Quality Bar

This file tells aipostgen what counts as good enough to show you. The review step
reads it to judge each draft and decide: pass, or send back for a rewrite. Edit it
freely — your changes apply on the next run.

A draft passes when it has no **blocking** issue. **Advisory** issues are listed
for you at the approval step but do not stop a post.

> **Calibration rule:** every example post in style_guide.md must pass this file
> with no blocking issue. If a rule here would reject one of your real posts, the
> rule is wrong. This version was checked against your seven posts and all seven pass.

---

## Post type — decide this first

The opening and the use of numbers depend on the kind of post. Set the type from
the angle in research_bundle.md.

- **Result post** — leads with a measured outcome. Numbers required.
- **Capability post** — introduces what a tool does. Numbers optional.
- **Opinion post** — a point of view. Numbers optional.
- **Casual post** — a short, light update or aside, often from the direct-text fast path. Lighter bar: only `on_style_guide` and `within_limits` are enforced (the opening, numbers, specificity, and advisory checks do not apply). It still has to sound like you.

## Blocking checks — a draft cannot pass with these

### opening_earns_attention
The first one or two lines must earn attention — through a provocative line, a
confident statement of value, or a measured result. No warm-up.
- pass: "Your README lies. Your code doesn't."
- pass: "codespine turns your TypeScript into a queryable graph"
- fail: "Today I want to share an update on my tool."

### result_claims_supported
Every performance or outcome claim must be backed by research_bundle.md and stated
with the concrete number. On capability and opinion posts this applies only where
the post states a measurable result.
- pass: "-61% / -97.6% / -99.7% latency cuts across 4 routes" (figures present in the bundle)
- fail: "much faster now" (no number, or a number that is not in the bundle)

### on_style_guide
Follows style_guide.md — but only for what no specific check below already covers
(tone, banned phrasing, required habits). Catch-all only; do not also report a
problem that a named check already covers.
- pass: confident, results-first, about one emoji per line break
- fail: "We are thrilled to announce..."

### within_limits
Within the platform length and format limits. Checked before review; the reviewer
only confirms.
- pass: an X draft at 240 characters
- fail: an X draft at 310 characters

## Advisory checks — listed at the approval step, do not block

- **not_native** — reads ported, not written for this platform.
- **single_idea** — the post tries to say more than one thing.
- **edge_preserved** — compared with the angle in research_bundle.md, the point of view was softened.
- **specific** — a generic word where a real name or number would fit.
- **concise** — words that do not earn their place.
- **reply_opening** — a question or opening for replies, where it fits.

Soft rule: if three or more advisory issues are open on one draft, mark it for
revision rather than passing it silently.

## Group check — after all three drafts exist

- **numbers_consistent** — the same figures appear identically across platforms.
- **drafts_distinct** — the three are written for their platform, not identical copies.

## How the reviewer behaves

- Every issue comes with a concrete suggested fix — never a vague instruction.
- Do not raise again an issue marked resolved in the previous review.json.
- Prefer passing: a correct but dull change is a regression. Keep the author's edge
  ahead of reviewer preference.
- The automatic loop runs at most twice, then the draft comes to you.

## Output: review.json

```json
{
  "post_type": "result | capability | opinion | casual",
  "drafts": [
    {
      "platform": "x | bsky | linkedin",
      "verdict": "pass | revise",
      "issues": [
        {
          "severity": "block | advice",
          "check": "opening_earns_attention | result_claims_supported | on_style_guide | within_limits | not_native | single_idea | edge_preserved | specific | concise | reply_opening",
          "problem": "",
          "suggested_fix": "",
          "resolved": false
        }
      ]
    }
  ],
  "group": {
    "numbers_consistent": true,
    "drafts_distinct": true,
    "issues": []
  }
}
```
