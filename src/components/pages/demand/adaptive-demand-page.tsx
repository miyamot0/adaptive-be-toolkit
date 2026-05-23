import { use, useEffect, useState } from "react";
import { ContentWrapper } from "../../layout/content-wrapper";
import { QuestionPresentation } from "./views/question-presentation";
import ChartRawConsumption from "./views/chart-raw-consumption";
import ChartRawExpenditure from "./views/chart-raw-expenditure";
import ChartBeliefs from "./views/chart-beliefs";
import { Button } from "#/components/ui/button.tsx";
import { DynamicInstructions } from "#/components/older/dynamic-instructions.tsx";
import { AdaptiveDemandContext } from "#/components/context/adaptive-demand-context.tsx";

type AdaptiveDemandPageProps = {
    ID: string;
    Reinforcer: string;
    RenderFigures?: boolean;
    DebugOutput?: boolean;
};

export default function AdaptiveDemandPage({
    ID,
    Reinforcer,
    RenderFigures = false,
    DebugOutput = false,
}: AdaptiveDemandPageProps) {
    const { POSM, setPOSM } = use(AdaptiveDemandContext);
    const [hasConfirmed, setHasConfirmed] = useState(false);

    useEffect(() => {
        const DEFAULT_PRICES = [
            ...[0.1, 0.25, 0.5, 0.75],
            ...Array.from({ length: 19 }, (_, i) => i * 0.5 + 1), // Generates [1, 1.5, 2, ..., 10]
            ...Array.from({ length: 40 }, (_, i) => i * 1 + 11) // Generates [11, 12, 13, ..., 50]
        ];

        POSM.init(DEFAULT_PRICES, ID, 0.25);

        setPOSM(POSM);
    }, [Reinforcer]);

    if (!hasConfirmed) {
        return <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer}`}>
            <DynamicInstructions Reinforcer={Reinforcer} Duration="over the past three months" >
                <Button onClick={() => setHasConfirmed(true)}  >Confirm Understanding</Button>
            </DynamicInstructions>
        </ContentWrapper>;
    }

    const renderFigures = (RenderFigures === false) ? null :
        <div className="grid grid-cols-3 w-full gap-4 min-h-30">
            <ChartBeliefs />
            <ChartRawExpenditure />
            <ChartRawConsumption />
        </div>;

    const sortedBeliefsCumulative = [...POSM.beliefsCumulative].sort((a, b) => b - a);
    const highestBelief = Math.max(...sortedBeliefsCumulative);
    const nAtHighestBelief = sortedBeliefsCumulative.filter(b => b === highestBelief).length;

    const threeHighestBeliefs = sortedBeliefsCumulative.slice(0, 3);
    const totalAtThreeHighest = threeHighestBeliefs.reduce((acc, val) => acc + val, 0);
    const nMatchingThreeHighest = sortedBeliefsCumulative.filter(b => threeHighestBeliefs.includes(b)).length;

    return (
        <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer}`}>
            {DebugOutput && <div>
                <span className="text-sm text-gray-500">Highest Belief: {highestBelief.toFixed(2)} (n = {nAtHighestBelief})</span>
                <span className="text-sm text-gray-500 ml-4">Total at Three Highest Beliefs: {totalAtThreeHighest.toFixed(2)} (n = {nMatchingThreeHighest})</span>
            </div>}

            {renderFigures}

            <QuestionPresentation />
        </ContentWrapper>
    );
}