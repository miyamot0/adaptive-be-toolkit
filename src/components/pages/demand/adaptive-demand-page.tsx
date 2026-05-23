import { use, useEffect } from "react";
import { ContentWrapper } from "../../layout/content-wrapper";
import { StateContext } from "../../context/state-context";
import { QuestionPresentation } from "./question-presentation";
import ChartRawConsumption from "../visuals/chart-raw-consumption";
import ChartRawExpenditure from "../visuals/chart-raw-expenditure";
import ChartBeliefs from "../visuals/chart-beliefs";

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
    const { POSMGeneric, setPOSMGeneric, SetSurveyUpdate } = use(StateContext);

    useEffect(() => {
        const DEFAULT_PRICES = [
            ...[0.1, 0.25, 0.5, 0.75],
            ...Array.from({ length: 49 }, (_, i) => i * 1 + 1) // Generates [1, 2, 3, ..., 49]
        ];

        POSMGeneric.init(DEFAULT_PRICES, ID, 0.25);

        const POSM_1 = POSMGeneric;

        setPOSMGeneric(POSM_1);
        SetSurveyUpdate(new Date());
    }, [Reinforcer]);

    const renderFigures = (RenderFigures === false) ? null :
        <div className="grid grid-cols-3 w-full gap-4 min-h-30">
            <ChartBeliefs POSM={POSMGeneric} />
            <ChartRawExpenditure POSM={POSMGeneric} />
            <ChartRawConsumption POSM={POSMGeneric} />
        </div>;

    const sortedBeliefsCumulative = [...POSMGeneric.beliefsCumulative].sort((a, b) => b - a);
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