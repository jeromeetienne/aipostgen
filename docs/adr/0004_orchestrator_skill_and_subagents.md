# ADR-0004: Orchestrator skill in the main thread, with research and review subagents

**Status:** Accepted
**Date:** 2026-06-21
**Deciders:** Jerome Etienne

## Context
The pipeline must map onto Claude Code primitives: skills, subagents, and commands. A subagent runs in an isolated context and returns a single result; it cannot pause to ask the user for a decision. Two phases are heavy or benefit from independence — research reads a great deal, and review should be unbiased — while the gates and the loop must talk to the user.

## Decision
The orchestrator is a user-invocable **skill** that runs in the **main thread** — the manager. It holds the run, drives the loop, and runs the two human gates. **Research** and **review** are **subagents** — contractors sent off with a brief that return a result. Writing happens in the main thread, because the rewrite loop and the gates live there.

## Options Considered

### Option A: Manager skill plus research and review subagents (chosen)
| Dimension | Assessment |
|---|---|
| Human-in-the-loop | Works — the gates run in the main thread |
| Context isolation | Good — heavy research stays isolated |
| Review independence | Good — a fresh subagent is unbiased |

**Pros:** the gates and the loop stay where the user can be reached; research keeps its large token intake out of the main context; review gets a fresh, independent view.
**Cons:** the writer and the reviewer share state only through files; subagents register at session start.

### Option B: Everything as subagents
**Pros:** maximum isolation and parallelism.
**Cons:** a subagent cannot run a human gate, which the pipeline needs twice.

### Option C: Everything in the main thread
**Pros:** simplest; one context.
**Cons:** research floods the context; review is biased by having watched the draft being written.

## Trade-off Analysis
The deciding constraint is that subagents cannot gate on the user. So orchestration and the gates stay in the main thread, and only the heavy, independent work (research) and the work that benefits from a fresh view (review) become subagents. A skill is knowledge and a subagent is an execution context; the two are orthogonal, so a subagent can be built from the same reference files the main thread reads.

## Consequences
- Easier: a clean split between interactive work and isolated work.
- Harder: custom subagents register at session start, so a freshly written agent becomes available the next session.
- Revisit: writing could move to parallel subagents if three-way speed ever matters.

## Action Items
1. [x] Write the /aipostgen orchestrator skill.
2. [x] Write the research and review agent definitions.
