// ── Link Builder Page (Refactored) ─────────────────────────────────────────────

import { useReducer } from "react";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "#/components/ui/tabs.tsx";
import {
  buildDemandUrl,
  buildDiscountingUrl,
} from "#/lib/posm/builder/url-builders.js";
import { AlgorithmThreshold } from "#/types/survey.js";
import { FieldRow } from "./components/field-row.js";
import { AlgorithmSection } from "./components/algorithm-section.js";
import { LinkPreview } from "./components/link-preview.js";
import { DemandReinforcerField } from "./components/demand-reinforcer-field.js";
import { DemandPricesField } from "./components/demand-prices-field.js";
import { DemandEntropyField } from "./components/demand-entropy-field.js";
import { DiscountingReinforcerField } from "./components/discounting-reinforcer-field.js";
import { DiscountingSSRLRRFields } from "./components/discounting-ssr-lrr-fields.js";
import { DiscountingDelaysField } from "./components/discounting-delays-field.js";
import { demandReducer } from "./state/demand-reducer.js";
import { discountingReducer } from "./state/discounting-reducer.js";

/**
 * Props for the LinkBuilderPage component.
 */
interface LinkBuilderPageProps {}

/**
 * Main Link Builder page component.
 * Orchestrates demand and discounting task configuration through tabs.
 * Uses typed reducers for state management and immutable UI components.
 */
export default function LinkBuilderPage(_props: LinkBuilderPageProps) {
  // ── Demand section state with reducer ───────────────────────────────────────
  const [demandState, dispatchDemand] = useReducer(demandReducer, {
    reinforcer: "Chicken Wings",
    showFigures: false,
    showDebug: false,
    algorithm: AlgorithmThreshold.RegretMin,
    maxTrials: "10",
    beta: "0.25",
    compound: true,
    prices: "",
    entropyThreshold: "0.01",
  });

  // ── Discounting section state with reducer ──────────────────────────────────
  const [discountingState, dispatchDiscounting] = useReducer(
    discountingReducer,
    {
      reinforcer: "Dollars",
      showFigures: false,
      showDebug: false,
      algorithm: AlgorithmThreshold.RegretMin,
      maxTrials: "10",
      beta: "0.25",
      compound: true,
      ssr: "50",
      llr: "100",
      delays: "",
      entropyThreshold: "0.01",
    },
  );

  // ── Derived URLs from state ──────────────────────────────────────────────────
  const demandUrl = buildDemandUrl(
    demandState.reinforcer,
    demandState.showFigures,
    demandState.showDebug,
    demandState.algorithm,
    demandState.maxTrials,
    demandState.beta,
    demandState.compound,
    demandState.prices,
    demandState.entropyThreshold,
  );

  const discountingUrl = buildDiscountingUrl(
    discountingState.reinforcer,
    discountingState.showFigures,
    discountingState.showDebug,
    discountingState.algorithm,
    discountingState.maxTrials,
    discountingState.beta,
    discountingState.compound,
    discountingState.ssr,
    discountingState.llr,
    discountingState.delays,
    discountingState.entropyThreshold,
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <PageWrapper ShowHeader ShowFooter>
      <div className="flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">Link Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure task parameters and copy the generated launch URL for
            embedding in your survey platform. Replace{" "}
            <code className="font-mono">CHANGEME</code> in the generated link
            with the participant's identifier before deploying.
          </p>
        </div>

        <Tabs defaultValue="demand">
          <TabsList className="w-full h-11">
            <TabsTrigger value="demand" className="flex-1">
              Adaptive Purchase Task
            </TabsTrigger>
            <TabsTrigger value="discounting" className="flex-1">
              Adaptive Discounting Task
            </TabsTrigger>
          </TabsList>

          {/* ── Demand tab ─────────────────────────────────────────────────────── */}
          <TabsContent value="demand">
            <div className="flex flex-col gap-5 pt-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Left column — algorithm + entropy threshold */}
                <div className="flex flex-col gap-4">
                  <AlgorithmSection
                    algorithm={demandState.algorithm}
                    setAlgorithm={(v) =>
                      dispatchDemand({ type: "SET_ALGORITHM", payload: v })
                    }
                    maxTrials={demandState.maxTrials}
                    setMaxTrials={(v) =>
                      dispatchDemand({ type: "SET_MAX_TRIALS", payload: v })
                    }
                    beta={demandState.beta}
                    setBeta={(v) =>
                      dispatchDemand({ type: "SET_BETA", payload: v })
                    }
                    compound={demandState.compound}
                    setCompound={(v) =>
                      dispatchDemand({ type: "SET_COMPOUND", payload: v })
                    }
                    idPrefix="d"
                  />

                  {demandState.algorithm === AlgorithmThreshold.RegretMin && (
                    <FieldRow>
                      <DemandEntropyField
                        value={demandState.entropyThreshold}
                        onChange={(v) =>
                          dispatchDemand({
                            type: "SET_ENTROPY_THRESHOLD",
                            payload: v,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Entropy threshold for adaptive stopping (0.01 = stop
                        early when beliefs concentrate, 0.5 = run many trials).
                        Default: 0.01
                      </p>
                    </FieldRow>
                  )}
                </div>

                {/* Right column — reinforcer + price levels */}
                <div className="flex flex-col gap-4">
                  <DemandReinforcerField
                    value={demandState.reinforcer}
                    onChange={(v) =>
                      dispatchDemand({ type: "SET_REINFORCER", payload: v })
                    }
                  />

                  <DemandPricesField
                    value={demandState.prices}
                    onChange={(v) =>
                      dispatchDemand({ type: "SET_PRICES", payload: v })
                    }
                  />
                </div>
              </div>

              <LinkPreview
                url={demandUrl}
                showFigures={demandState.showFigures}
                setShowFigures={(v) =>
                  dispatchDemand({ type: "SET_SHOW_FIGURES", payload: v })
                }
                showDebug={demandState.showDebug}
                setShowDebug={(v) =>
                  dispatchDemand({ type: "SET_SHOW_DEBUG", payload: v })
                }
                idPrefix="d"
              />
            </div>
          </TabsContent>

          {/* ── Discounting tab ─────────────────────────────────────────────────── */}
          <TabsContent value="discounting">
            <div className="flex flex-col gap-5 pt-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Left column — algorithm + entropy threshold */}
                <div className="flex flex-col gap-4">
                  <AlgorithmSection
                    algorithm={discountingState.algorithm}
                    setAlgorithm={(v) =>
                      dispatchDiscounting({ type: "SET_ALGORITHM", payload: v })
                    }
                    maxTrials={discountingState.maxTrials}
                    setMaxTrials={(v) =>
                      dispatchDiscounting({
                        type: "SET_MAX_TRIALS",
                        payload: v,
                      })
                    }
                    beta={discountingState.beta}
                    setBeta={(v) =>
                      dispatchDiscounting({ type: "SET_BETA", payload: v })
                    }
                    compound={discountingState.compound}
                    setCompound={(v) =>
                      dispatchDiscounting({ type: "SET_COMPOUND", payload: v })
                    }
                    idPrefix="c"
                  />

                  {discountingState.algorithm ===
                    AlgorithmThreshold.RegretMin && (
                    <FieldRow>
                      <DemandEntropyField
                        value={discountingState.entropyThreshold}
                        onChange={(v) =>
                          dispatchDiscounting({
                            type: "SET_ENTROPY_THRESHOLD",
                            payload: v,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Entropy threshold for adaptive stopping (0.01 = stop
                        early when beliefs concentrate, 0.5 = run many trials).
                        Default: 0.01
                      </p>
                    </FieldRow>
                  )}
                </div>

                {/* Right column — reinforcer + reward values + delay levels */}
                <div className="flex flex-col gap-4">
                  <DiscountingReinforcerField
                    value={discountingState.reinforcer}
                    onChange={(v) =>
                      dispatchDiscounting({
                        type: "SET_REINFORCER",
                        payload: v,
                      })
                    }
                  />

                  <DiscountingSSRLRRFields
                    ssr={discountingState.ssr}
                    setSsr={(v) =>
                      dispatchDiscounting({ type: "SET_SSR", payload: v })
                    }
                    llr={discountingState.llr}
                    setLlr={(v) =>
                      dispatchDiscounting({ type: "SET_LLR", payload: v })
                    }
                  />

                  <DiscountingDelaysField
                    value={discountingState.delays}
                    onChange={(v) =>
                      dispatchDiscounting({ type: "SET_DELAYS", payload: v })
                    }
                  />
                </div>
              </div>

              <LinkPreview
                url={discountingUrl}
                showFigures={discountingState.showFigures}
                setShowFigures={(v) =>
                  dispatchDiscounting({ type: "SET_SHOW_FIGURES", payload: v })
                }
                showDebug={discountingState.showDebug}
                setShowDebug={(v) =>
                  dispatchDiscounting({ type: "SET_SHOW_DEBUG", payload: v })
                }
                idPrefix="c"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
