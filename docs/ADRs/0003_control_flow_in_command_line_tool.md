# ADR-0003: Control flow in a TypeScript command-line tool, not a prose-only skill

**Status:** Accepted
**Date:** 2026-06-21
**Deciders:** Jerome Etienne

## Context
The orchestration — the phase sequence, the rewrite loop, the two-pass cap, and the gates — is a state machine. A self-review of the design found that leaving this control flow to the language model, as a prose-only skill, puts the least reliable component in charge of the most order-sensitive logic.

## Decision
Put the control flow in a small TypeScript command-line tool, run with tsx, with arguments parsed by Commander and data validated by Zod. The tool owns `state.json` and decides the next action. The `/aipostgen` skill calls the tool and performs the creative work; it never decides the phase itself.

## Options Considered

### Option A: TypeScript command-line tool (chosen)
| Dimension | Assessment |
|---|---|
| Reliability of control flow | High — deterministic code |
| Stack fit | High — matches the existing TypeScript, tsx, Commander, Zod stack |
| Build effort | Medium |

**Pros:** the loop, the cap, the phase transitions, and resume are deterministic and testable in isolation.
**Cons:** more to build up front than prose.

### Option B: Prose-only skill
**Pros:** fastest to stand up.
**Cons:** the model must remember the loop, the cap, and the order on every run — the least reliable place for control flow.

### Option C: Prose first, harden to code later
**Pros:** quickest path to something usable.
**Cons:** builds the control flow twice.

## Trade-off Analysis
The same principle that separates mechanical checks from judgment applies one level up: deterministic control flow belongs in code, creative work belongs in the model. The tool is small and matches the existing stack, so the extra build cost is low and the reliability gain is large.

## Consequences
- Easier: the loop and the gates behave the same way every run; resume is mechanical.
- Harder: a small body of TypeScript to maintain.
- Revisit: none expected; the surface is small.

## Action Items
1. [x] Build run_state, state_machine, run_store, and the command-line interface.
2. [x] Verify the action sequence with a trace and a real run.
