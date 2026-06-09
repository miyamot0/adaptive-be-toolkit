import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { ContentWrapper } from "#/components/layout/content-wrapper.tsx";
import { Button } from "#/components/ui/button.tsx";
import type { AlgorithmThreshold } from "#/types/survey.ts";
import { use, useEffect } from "react";
import { DiscountingQuestionPresentation } from "./views/discounting-question-presentation";
import { ChartDiscountingBeliefs } from "../../figures/chart-beliefs";
import ChartRawChoice from "../../figures/chart-raw-choice";
import ChartEntropy from "../../figures/chart-entropy";
import { DynamicDiscountingInstructions } from "#/components/pages/discounting/views/dynamic-discounting-instructions.tsx";
import TaskCompleted from "#/components/common/task-completed.tsx";
import { CommonTaskContext } from "#/components/context/common-task-context.tsx";

type AdaptiveDiscountingPageProps = {
  ID: string;
  Reinforcer: string;
  RenderFigures?: boolean;
  DebugOutput?: boolean;
  SSR: number;
  LLR: number;
  Algorithm: AlgorithmThreshold;
  CompoundSuppression: boolean;
  Beta: number;
  Delays: number[];
  MaxTrials?: number;
  EntropyThreshold?: number;
};

export default function AdaptiveDiscountingPage({
  ID,
  Reinforcer,
  RenderFigures = false,
  DebugOutput = false,
  SSR,
  LLR,
  Algorithm,
  CompoundSuppression,
  Beta,
  Delays,
  MaxTrials = 20,
  EntropyThreshold = 0.05,
}: AdaptiveDiscountingPageProps) {
  const { POSM, setPOSM } = use(AdaptiveDiscountingContext);
  const { HasFinished, HasConfirmed, setHasConfirmed } = use(CommonTaskContext);

  useEffect(() => {
    POSM.init(Delays, ID, Beta);
    POSM.set_entropy_threshold(EntropyThreshold);
    POSM.setValues(SSR, LLR);
    POSM.set_algorithm(Algorithm);
    POSM.set_compound_suppression(CompoundSuppression);
    POSM.set_max_turns(MaxTrials);
    setPOSM(POSM);
  }, [Reinforcer]);

  if (!HasConfirmed) {
    return (
      <ContentWrapper Title={`Decision-making Task`}>
        <DynamicDiscountingInstructions
          Reinforcer={Reinforcer}
          SSR={SSR}
          LLR={LLR}
        >
          <Button onClick={() => setHasConfirmed(true)} variant="outline">
            I Understand the Task
          </Button>
        </DynamicDiscountingInstructions>
      </ContentWrapper>
    );
  }

  const renderFigures =
    RenderFigures === false ? null : (
      <div className="grid grid-cols-3 w-full gap-2 min-h-50">
        <ChartDiscountingBeliefs
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
            label: "Raw Choice Data",
            data: POSM.responses.map((response) => ({
              x: response.Delay,
              y: response.Waited ? 1 : 0,
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
    <ContentWrapper
      Title={`Decision-making Task for ${Reinforcer}`}
      ShowTitle={false}
    >
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

      <DiscountingQuestionPresentation Reinforcer={Reinforcer} />
    </ContentWrapper>
  );
}
