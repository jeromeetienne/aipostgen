# ADR-0001: Four-phase pipeline with two human gates

**Status:** Accepted
**Date:** 2026-06-21
**Deciders:** Jerome Etienne

## Context
aipostgen turns one input — a URL, a public repository, or a few words — into review-ready posts for X, Bluesky, and LinkedIn. The posts go to real accounts, so a wrong or low-quality post is costly and hard to undo. The work has distinct stages — gathering material, writing, checking quality — and the checking stage may need several rewrites.

## Decision
Use a four-phase pipeline: **research → write → review (with a rewrite loop) → publish**. Add two human gates: a cheap **angle confirmation** right after research, and a **final approval** before output. The first version stops at **paste-ready drafts** that the user copies and pastes; publishing is deferred.

## Options Considered

### Option A: Four-phase pipeline with two gates (chosen)
| Dimension | Assessment |
|---|---|
| Quality control | High — two checkpoints catch a wrong direction early and weak copy late |
| Friction | Medium — two interruptions per run |
| Build effort | Medium |

**Pros:** a wrong angle is caught before any drafting effort; a human signs off before anything is posted; the rewrite loop improves copy on its own.
**Cons:** more interaction than a one-shot generator.

### Option B: One-shot generation, no gates
**Pros:** fastest, least friction.
**Cons:** no chance to correct the angle; no guard before posting to real accounts; quality is whatever the first try produces.

### Option C: Fully autonomous publishing
**Pros:** hands-off.
**Cons:** posts mistakes to real accounts permanently; an unacceptable risk for a personal brand.

## Trade-off Analysis
The deciding force is that posts are public and permanent. The two gates trade a little friction for the ability to stop a bad post. The angle gate in particular saves wasted work: a wrong direction is caught in seconds, before three drafts and a review loop. Deferring publishing keeps the fragile browser and platform automation out of the first version, so the core value — good drafts — ships first.

## Consequences
- Easier: safe, reviewable output; wrong directions are cheap to correct.
- Harder: each run has two stops for the user.
- Revisit: add publishing later as its own phase (X and LinkedIn through a browser, Bluesky through its client).

## Action Items
1. [x] Encode the phases and the gates in the run state machine.
2. [ ] Add the publish phase once the drafting flow is proven.
