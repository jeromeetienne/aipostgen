# Documentation

## Blog

The [`./blog`](blog/) directory contains a three-part series about aipostgen,
written for hiring managers and users. The arc, synopses, and style spec are in
[blog_series_plan.md](blog/blog_series_plan.md).

1. [My AI writes my social posts. It is not allowed to publish them.](blog/01_my_ai_writes_my_posts_but_cannot_publish_them.md)
   — what the tool does, from the user's side.
2. [How I built aipostgen: the model writes, the code decides.](blog/02_the_model_writes_the_code_decides.md)
   — the architecture and the decisions behind it.
3. [Keep the state machine out of the LLM.](blog/03_keep_the_state_machine_out_of_the_llm.md)
   — the transferable lesson for any tool built on a language model.

## Architecture Decision Records

The [`./adr`](adr/) directory contains this project's **Architecture Decision Records (ADRs)**.

An ADR is a short text document that captures a single significant architectural
decision, along with its context and consequences. The format follows the approach
described by Michael Nygard in
[Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

Each record captures one decision and typically includes:

- **Title** — a short, descriptive name for the decision.
- **Status** — proposed, accepted, deprecated, or superseded.
- **Context** — the forces at play: the technical, business, and team factors that
  motivated the decision.
- **Decision** — the change being proposed or made, stated in active voice.
- **Consequences** — the resulting context after applying the decision, including the
  trade-offs, both positive and negative.

ADRs are immutable: once accepted, a record is never edited. If a decision is later
revisited, a new ADR is written that supersedes the old one, preserving the full
history of how the architecture evolved over time.


