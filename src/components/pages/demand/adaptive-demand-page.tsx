import { use, useEffect } from "react";
import { ContentWrapper } from "../../layout/content-wrapper";
import { StateContext } from "../../context/state-context";
import { QuestionPresentation } from "./question-presentation";
import ChartRawConsumption from "../visuals/chart-raw-consumption";
import ChartRawExpenditure from "../visuals/chart-raw-expenditure";
import ChartBeliefs from "../visuals/chart-beliefs";

const RENDER_FIGS: boolean = true;

export default function AdaptiveDemandPage({
    Reinforcer,
}: {
    Reinforcer: string;
}) {
    const { POSMGeneric, setPOSMGeneric, ResponseCount, SetSurveyUpdate } = use(StateContext);

    useEffect(() => {
        const DEFAULT_PRICES = [
            ...[0.1, 0.5],
            ...Array.from({ length: 29 }, (_, i) => i * 1 + 1) // Generates [1, 2, 3, ..., 29]
        ];

        POSMGeneric.init(DEFAULT_PRICES, 0.5);

        const POSM_1 = POSMGeneric;

        setPOSMGeneric(POSM_1);
        SetSurveyUpdate(new Date());
    }, [Reinforcer]);

    const renderFigures = (RENDER_FIGS === false) ? null :
        <div className="grid grid-cols-3 w-full gap-4 min-h-50">
            <ChartBeliefs POSM={POSMGeneric} />
            <ChartRawExpenditure POSM={POSMGeneric} />
            <ChartRawConsumption POSM={POSMGeneric} />
        </div>;

    return (
        <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer} (${ResponseCount})`}>
            <QuestionPresentation />

            {renderFigures}
        </ContentWrapper>
    );
}