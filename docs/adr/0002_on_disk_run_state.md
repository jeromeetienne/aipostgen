# ADR-0002: On-disk run directory with state.json as the backbone

**Status:** Accepted
**Date:** 2026-06-21
**Deciders:** Jerome Etienne

## Context
A run spans several phases and a rewrite loop that can repeat. The state has to survive a long session and let a run resume after a pause. Holding the state only in the conversation is fragile: it grows the context, and it is lost when the session ends.

## Decision
Each run is a directory, `posts/<YYYYMMDD>_<slug>/`, holding `state.json` and its artifacts: `research_bundle.md`, `assets/`, `drafts/`, and `review.json`. `state.json` is the single source of truth for the run. Phases pass directory paths, not content.

## Options Considered

### Option A: On-disk state.json (chosen)
| Dimension | Assessment |
|---|---|
| Resumability | High |
| Context size | Low — phases pass paths, not content |
| Build effort | Medium — needs a schema and a store |

**Pros:** a run resumes from disk; the main context stays small; there is an audit trail.
**Cons:** needs an explicit state schema and read/write code.

### Option B: Conversation or in-memory state
**Pros:** no storage code.
**Cons:** grows the context across rewrite loops; lost when the session ends; not resumable.

### Option C: Infer the phase from which files exist
**Pros:** no separate state file.
**Cons:** ambiguous — a half-written drafts directory and an unapproved angle cannot be told apart. This ambiguity is the reason an explicit `state.json` exists.

## Trade-off Analysis
File-presence inference is too weak to drive control flow. An explicit, validated `state.json` records the phase, the gate flags, and the per-platform draft status — exactly what resume needs. The cost is a small schema and store, which is modest.

## Consequences
- Easier: a run resumes from `state.json`; the main context holds paths, not large content.
- Harder: the state shape must stay in step with the phases.
- Revisit: locking if several runs ever execute at once.

## Action Items
1. [x] Define the state schema with Zod and a store (load, save, create, list).
2. [x] Derive the next action from `state.json`.
