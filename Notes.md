# Entropy Stop Point — Notes

## Context

Shannon entropy ($H = -\sum p \ln p$, in nats) over `beliefsCumulative` is computed after each trial in `src/lib/helpers/arrays.ts` (`computeEntropy`). The `RegretMin` threshold in `src/lib/helpers/thresholds.ts` stops the task when the rolling average entropy drop over the last `ENTROPY_WINDOW = 3` trials falls below `ENTROPY_PLATEAU_THRESHOLD = 0.01` nats — i.e., beliefs have stopped concentrating.

Belief updates in `src/lib/posm/discounting/discounting-actions.ts` (`agent_update_beliefs`) multiply ruled-out indices by `beta` each trial, which is the primary driver of entropy reduction.

---

## A) More Rapidly Decreasing Entropy

**1. Lower beta (most direct lever)**
`beta` multiplies the beliefs of ruled-out levels each trial. Lower beta → more aggressive suppression → faster concentration → faster entropy drop. Current default: `0.5`. Dropping to `0.3`–`0.35` produces noticeably steeper drops per trial. Already URL-overridable via the `dynamicBeta` parameter on `init()`.

**2. Asymmetric beta by response type**
A "waited" response rules out all delays above the current one (potentially a large swathe), while "did not wait" is a sharper, confirmatory signal near ED50. Apply a tighter beta for "not waited" than for "waited" — e.g., `betaWait = 0.5`, `betaNoWait = 0.3` — to concentrate beliefs faster without disrupting early exploration.

**3. Compounding suppression**
Instead of a fixed `value * beta`, apply `value * beta^k` where `k` increments with `algo.turn`. Early trials remain lenient; suppression compounds as the task progresses, narrowing the distribution faster in later trials.

---

## B) More Relaxed Entropy Stop Point (Stop Earlier)

**1. Raise `ENTROPY_PLATEAU_THRESHOLD`** _(easiest change)_
Currently `0.01` nats in `thresholds.ts`. Raising to `0.02`–`0.05` triggers stop sooner, accepting that beliefs are still slowly concentrating but "good enough." Risk: stopping before beliefs distinguish adjacent levels.

**2. Reduce `ENTROPY_WINDOW`**
Currently `3`. Reducing to `2` makes the rolling average more volatile and more likely to hit the threshold on a brief plateau. Best combined with a small threshold increase for stability.

**3. Absolute entropy floor**
Rather than (or in addition to) plateau detection, stop when $H < \alpha \cdot \ln(N)$ — a fraction of maximum entropy. For example, `H < 0.35 * ln(N)` means ~65% of maximum uncertainty has been eliminated. More principled than a ∆H check because it is invariant to the number of levels $N$.

**4. Lower `CONCENTRATION_THRESHOLD_SINGLE`**
The `BeliefConcentration` threshold fires when the top belief(s) exceed `0.68` (in `thresholds.ts`). Reducing to `0.55`–`0.60` stops earlier with a less peaked distribution. `BeliefConcentration` and `RegretMin` are independent paths and could be combined with an OR condition.

**5. Lower `min_responses`**
Currently `5` on `DiscountingAgent`. This is the burn-in guard before any threshold is evaluated. Reducing to `3` allows earlier triggering once minimum exploration is done.

---

## Summary

| Lever                                | Located in                         | Effect                                          |
| ------------------------------------ | ---------------------------------- | ----------------------------------------------- |
| `beta` (lower = faster)              | `init()` / `dynamicBeta` URL param | Direct: controls suppression per trial          |
| Asymmetric `betaWait` / `betaNoWait` | `discounting-actions.ts`           | Faster convergence without changing exploration |
| Compounding `beta^turn`              | `discounting-actions.ts`           | Accelerating suppression in later trials        |
| `ENTROPY_PLATEAU_THRESHOLD` ↑        | `thresholds.ts`                    | Relaxed: stop on slower-fading entropy          |
| `ENTROPY_WINDOW` ↓                   | `thresholds.ts`                    | Noisier rolling average, earlier trigger        |
| Absolute $H < \alpha \ln N$          | `thresholds.ts`                    | N-invariant, principled floor                   |
| `CONCENTRATION_THRESHOLD_SINGLE` ↓   | `thresholds.ts`                    | Less peaked belief required to stop             |
