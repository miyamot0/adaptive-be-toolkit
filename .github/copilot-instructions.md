# Adaptive BE Toolkit — Copilot Instructions

## Project Overview

The **Adaptive BE Toolkit** is a self-contained, iframe-embeddable web application for administering adaptive behavioral economics measures in online research studies. It is built to integrate into existing survey platforms (Qualtrics, REDCap, custom web studies) without requiring any server-side infrastructure from the researcher. All task logic, adaptive algorithms, and question sequencing run entirely in the browser. Results are returned to the host page in real time via the browser's native `postMessage` API — no data is stored or transmitted by the toolkit itself.

The toolkit targets behavioral scientists who need efficient, psychometrically adaptive alternatives to fixed-price-list demand tasks and fixed-delay discounting procedures.

---

## Measures

### Adaptive Purchase Task (`/demand/<participantId>`)

An agent-based, adaptive operant demand procedure. The goal is to efficiently estimate **O_max** (the maximum total expenditure a participant exhibits) and **P_max** (the price at which that maximum expenditure occurs). Rather than presenting a fixed list of prices, the algorithm uses a belief-updating procedure to select the next price point based on the participant's response history, converging on the demand curve's peak expenditure region with a minimal number of trials (default maximum: 20).

Key domain concepts:
- **Reinforcer**: The commodity being purchased (e.g., "Coffee", "Cigarettes"). Displayed in question prompts.
- **Price**: The cost presented to the participant for a given quantity of the reinforcer.
- **Quantity / Consumption**: How many units the participant reports they would purchase at the presented price.
- **Expenditure / Revenue**: Price × Quantity — the primary signal the algorithm optimizes around.
- **O_max**: Maximum observed expenditure across all trials.
- **P_max**: The price associated with O_max.
- **Breakpoint**: The price at which consumption drops to zero.

Output payload fields: `ID`, `MaxExpenditure`, `MaxExpenditurePrice`, `MaxExpenditureQuantity`, `Beta`.

### Adaptive Delay Discounting Task (`/discounting/<participantId>`)

An agent-based, adaptive delay discounting procedure. The goal is to efficiently estimate **ED50** — the delay at which the participant is indifferent between a smaller-sooner reward (SSR) and a larger-later reward (LLR). The task presents binary choice questions ("Would you prefer $50 now or $100 in X days?") and adaptively selects the next delay based on the participant's choices.

Key domain concepts:
- **SSR (Smaller-Sooner Reinforcer)**: The immediate reward amount (default: 50).
- **LLR (Larger-Later Reinforcer)**: The delayed reward amount (default: 100).
- **Delay**: The time period (in days) attached to the LLR in each trial.
- **ED50**: The estimated delay at which p(choosing LLR) = 0.50 — the indifference point.
- **Waiting / Not Waiting**: Whether the participant chose the delayed (LLR) or immediate (SSR) option.

Output payload fields: `ID`, `MaxDelay`, `Beta`.

---

## Adaptive Algorithm (POSM)

Both measures share a common abstract base class, `Algorithm` (`src/lib/posm/common/algorithm.ts`), which implements a **probabilistic belief-updating, optimal-stopping** adaptive procedure. Concrete implementations are `DemandAgent` and `DiscountingAgent`.

Core algorithm concepts:
- **Levels**: The discrete set of stimulus values (prices for demand; delays for discounting) that the agent can present. Initialized at task start.
- **Beliefs**: A probability array over levels, initialized uniformly. Updated after each response to concentrate probability mass around the estimated target region.
- **Beta (adaptation rate)**: Controls how aggressively beliefs are updated. Default: `0.5`. Can be overridden via the `dynamicBeta` parameter on `init()`.
- **Exploration phase**: Early trials use `explore_non_zero` / `explore_zero` to sample broadly across levels and establish the shape of responding.
- **Exploitation phase**: Once minimum data thresholds are met, the agent switches to `exploit`, selecting the level with the highest belief mass to refine the estimate.
- **Termination (AlgorithmThreshold)**: Tasks end when `MaximumIteration` (default 20 turns), `RegretMin`, or `BeliefConcentration` thresholds are met. `None` disables automatic stopping.
- **AlgorithmAction enum**: `NonconsumptionFound`, `ConsumptionFoundInitial`, `ConsumptionFoundNonInitial` — used internally by `DemandAgent` to route belief updates through the correct update path.

The demand agent requires a minimum of `min_nonzero_consumption_points` (default: 3) non-zero consumption observations before switching from exploration to exploitation. The discounting agent uses a simpler exploit-only loop after initialization.

---

## Integration & URL Parameters

Each measure is accessed at a path that includes a mandatory participant identifier (minimum 6 characters):

```
/demand/<participantId>?reinforcer=Coffee&figures=true&debug=true
/discounting/<participantId>?reinforcer=Dollars&ssr=20&llr=100
```

The participant `id` is embedded in the URL path (not a query parameter) and is echoed back verbatim in the completion payload.

**Shared parameters**: `reinforcer`, `figures` (dev diagnostic charts), `debug` (dev stats overlay).  
**Discounting-only parameters**: `ssr` (number), `llr` (number).

Completion is signaled by a `postMessage` to the parent window:

```javascript
{ type: "ACTION_COMPLETE", payload: { ID, ...taskFields } }
```

The parent must always validate `event.origin` before trusting the payload.

---

## Tech Stack & Conventions

- **Framework**: React 19 + TypeScript, built with Vite.
- **Routing**: TanStack Router (file-based routes under `src/routes/`). Route parameters provide task `id` and optional query params.
- **Styling**: Tailwind CSS + shadcn/ui component library (`src/components/ui/`).
- **State/Context**: React Context (`src/components/context/`) manages agent state for each task type. Common context handles shared UI state (e.g., task completion flag).
- **Documentation**: MDX files in `content/docs/` processed by content-collections. Each file carries frontmatter: `title`, `description`, `summary`, `index`, `type`, `slug`, `date`. Rendered via TanStack Router at `/documentation/<slug>`.
- **Notify/Callback**: `src/lib/helpers/notify/` and task-specific helpers (`demand-notify-parent.ts`, `discounting-notify-parent.ts`) compose and dispatch the `postMessage` payload on task completion.
- **Types**: Core domain types live in `src/types/` (`demand.ts`, `discounting.ts`, `iframe-message.ts`, `survey.ts`).
- **Algorithm modules**: All POSM algorithm code is isolated under `src/lib/posm/`. Demand and discounting each have their own subdirectory; shared base logic lives in `posm/common/`.

### File Naming Conventions

- Route files follow TanStack Router file-based convention: `demand.$id.index.tsx`, `discounting.$id.index.tsx`.
- Algorithm sub-modules are named by role: `*-agent.ts` (main class), `*-agent-decision.ts`, `*-agent-explore.ts`, `*-agent-exploit.ts`, `*-agent-transition.ts`, `*-agent-appraise-performance.ts`, `*-actions.ts`.
- View components (charts, question displays) live in `src/components/pages/<task>/views/`.

### Key Design Constraints

- The toolkit is **stateless** — no backend, no persistence. All data flows out through `postMessage`.
- Configuration is **URL-only** — researchers change behavior by changing query parameters, never by editing source code.
- The participant identifier must be in the **path segment**, not a query string, to ensure it is reliably available to the algorithm at initialization.
- Diagnostic features (`figures`, `debug`) are intended for development and piloting only and should not be enabled in live data-collection deployments.
