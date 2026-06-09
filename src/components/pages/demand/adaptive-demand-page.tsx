import { use, useEffect } from "react";
import { ContentWrapper } from "../../layout/content-wrapper";
import { QuestionPresentation } from "./views/demand-question-presentation";
import { Button } from "#/components/ui/button.tsx";
import { DynamicDemandInstructions } from "#/components/pages/demand/views/dynamic-demand-instructions.tsx";
import { AdaptiveDemandContext } from "#/components/context/adaptive-demand-context.tsx";
import { AlgorithmThreshold } from "#/types/survey.ts";
import TaskCompleted from "#/components/common/task-completed.tsx";
import { CommonTaskContext } from "#/components/context/common-task-context.tsx";
import type { DemandMethodology } from "#/types/demand/demand-methodology.ts";
import { ChartDemandBeliefs } from "#/components/figures/chart-beliefs.tsx";
import ChartEntropy from "#/components/figures/chart-entropy.tsx";
import ChartRawChoice from "#/components/figures/chart-raw-choice.tsx";

type AdaptiveDemandPageProps = {
  ID: string;
  Reinforcer: string;
  Method?: DemandMethodology;
  RenderFigures?: boolean;
  DebugOutput?: boolean;
  Algorithm?: AlgorithmThreshold;
  Beta?: number;
  Prices: number[];
  CompoundSuppression?: boolean;
  MaxTrials?: number;
  EntropyThreshold?: number;
};

export default function AdaptiveDemandPage({
  ID,
  Reinforcer,
  Method = "posm",
  RenderFigures = false,
  DebugOutput = false,
  Algorithm = AlgorithmThreshold.MaximumIteration,
  Beta = 0.25,
  Prices,
  CompoundSuppression = false,
  MaxTrials = 20,
  EntropyThreshold = 0.05,
}: AdaptiveDemandPageProps) {
  const { POSM, setPOSM } = use(AdaptiveDemandContext);
  const { HasFinished, HasConfirmed, setHasConfirmed } = use(CommonTaskContext);

  useEffect(() => {
    POSM.init(Prices, ID, Beta);
    POSM.set_entropy_threshold(EntropyThreshold);
    POSM.set_algorithm(Algorithm);
    POSM.set_compound_suppression(CompoundSuppression);
    POSM.set_max_turns(MaxTrials);

    setPOSM(POSM);
  }, [Reinforcer]);

  if (!HasConfirmed) {
    return (
      <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer}`}>
        <DynamicDemandInstructions
          Reinforcer={Reinforcer}
          Duration="over the past three months"
          Method={Method}
        >
          <Button onClick={() => setHasConfirmed(true)}>
            Confirm Understanding
          </Button>
        </DynamicDemandInstructions>
      </ContentWrapper>
    );
  }

  const renderFigures =
    RenderFigures === false ? null : (
      <div className="grid grid-cols-4 w-full gap-2 min-h-50">
        <ChartDemandBeliefs
          seriesData={{
            label: "Belief Distribution",
            data: POSM.levels.map((_, index) => ({
              x: POSM.levels[index],
              y: POSM.beliefsCumulative[index],
            })),
          }}
        />
        <ChartEntropy
          seriesData={{
            label: "Belief Entropy",
            data: POSM.responses.map((response, index) => ({
              x: index + 1,
              y: response.Entropy,
            })),
          }}
        />
        <ChartRawChoice
          seriesData={{
            label: "Raw Expenditure Data",
            data: POSM.responses.map((response) => ({
              x: response.Price,
              y: response.Revenue,
            })),
          }}
        />

        <ChartRawChoice
          seriesData={{
            label: "Raw Consumption Data",
            data: POSM.responses.map((response) => ({
              x: response.Price,
              y: response.Quantity,
            })),
          }}
        />
      </div>
    );

  if (HasFinished) {
    return (
      <div className="flex flex-col gap-2">
        {renderFigures}
        {DebugOutput && <pre>{JSON.stringify(POSM.prediction, null, 2)}</pre>}
        <TaskCompleted />
      </div>
    );
  }

  const sortedBeliefsCumulative = [...POSM.beliefsCumulative].sort(
    (a, b) => b - a,
  );
  const highestBelief = Math.max(...sortedBeliefsCumulative);
  const nAtHighestBelief = sortedBeliefsCumulative.filter(
    (b) => b === highestBelief,
  ).length;

  return (
    <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer}`}>
      {DebugOutput && (
        <div className="flex flex-row gap-2">
          <span className="text-sm text-gray-500">
            Questions Asked: {POSM.turn - 1};
          </span>
          <span className="text-sm text-gray-500">
            Highest Belief: {highestBelief.toFixed(2)} (n = {nAtHighestBelief})
          </span>
        </div>
      )}

      {renderFigures}

      <QuestionPresentation />
    </ContentWrapper>
  );
}
