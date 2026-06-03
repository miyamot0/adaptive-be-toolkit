import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { ContentWrapper } from "#/components/layout/content-wrapper.tsx";
import { Button } from "#/components/ui/button.tsx";
import { AlgorithmThreshold } from "#/types/survey.ts";
import { use, useEffect } from "react";
import { DiscountingQuestionPresentation } from "./views/discounting-question-presentation";
import ChartDiscountingBeliefs from "./views/chart-discounting-beliefs";
import ChartRawChoice from "./views/chart-raw-choice";
import ChartEntropy from "./views/chart-entropy";
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
    Beta: number;
    Delays: number[];
};

export default function AdaptiveDiscountingPage({
    ID,
    Reinforcer,
    RenderFigures = false,
    DebugOutput = false,
    SSR,
    LLR,
    Algorithm,
    Beta,
    Delays,
}: AdaptiveDiscountingPageProps) {
    const { POSM, setPOSM, } = use(AdaptiveDiscountingContext);
    const { HasFinished, HasConfirmed, setHasConfirmed } = use(CommonTaskContext);

    useEffect(() => {
        POSM.init(Delays, ID, Beta);
        POSM.setValues(SSR, LLR);
        POSM.set_algorithm(Algorithm);

        setPOSM(POSM);
    }, [Reinforcer]);

    if (!HasConfirmed) {
        return <ContentWrapper Title={`Decision-making Task for ${Reinforcer}`}>
            <DynamicDiscountingInstructions Reinforcer={Reinforcer}>
                <Button onClick={() => setHasConfirmed(true)} >Confirm Understanding</Button>
            </DynamicDiscountingInstructions>
        </ContentWrapper>;
    }

    const renderFigures = (RenderFigures === false) ? null :
        <div className="grid grid-cols-3 w-full gap-4 min-h-30">
            <ChartDiscountingBeliefs />
            <ChartRawChoice />
            <ChartEntropy />
        </div>;

    if (HasFinished) {
        return <div className="flex flex-col gap-2">
            {renderFigures}
            <TaskCompleted />
        </div>;
    }

    const sortedBeliefsCumulative = [...POSM.beliefsCumulative].sort((a, b) => b - a);
    const highestBelief = Math.max(...sortedBeliefsCumulative);
    const nAtHighestBelief = sortedBeliefsCumulative.filter(b => b === highestBelief).length;

    const twoHighestBeliefs = sortedBeliefsCumulative.slice(0, 2);
    const totalAtTwoHighest = twoHighestBeliefs.reduce((acc, val) => acc + val, 0);
    const nMatchingTwoHighest = sortedBeliefsCumulative.filter(b => twoHighestBeliefs.includes(b)).length;

    const threeHighestBeliefs = sortedBeliefsCumulative.slice(0, 3);
    const totalAtThreeHighest = threeHighestBeliefs.reduce((acc, val) => acc + val, 0);
    const nMatchingThreeHighest = sortedBeliefsCumulative.filter(b => threeHighestBeliefs.includes(b)).length;

    return <ContentWrapper Title={`Decision-making Task for ${Reinforcer}`} ShowTitle={false}>
        {DebugOutput && <div className="flex flex-row gap-2">
            <span className="text-sm text-gray-500">Questions Asked: {POSM.turn - 1}</span>
            <span className="text-sm text-gray-500">Highest Belief: {highestBelief.toFixed(2)} (n = {nAtHighestBelief})</span>
            <span className="text-sm text-gray-500">Total at Two Highest Beliefs: {totalAtTwoHighest.toFixed(2)} (n = {nMatchingTwoHighest})</span>
            <span className="text-sm text-gray-500">Total at Three Highest Beliefs: {totalAtThreeHighest.toFixed(2)} (n = {nMatchingThreeHighest})</span>
        </div>}

        {renderFigures}

        <DiscountingQuestionPresentation Reinforcer={Reinforcer} />
    </ContentWrapper>
}