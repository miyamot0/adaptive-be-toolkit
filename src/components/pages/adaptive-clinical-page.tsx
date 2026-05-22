import { use, useEffect } from "react";
import { ContentWrapper } from "../layout/content-wrapper";
import { StateContext } from "../context/state-context";
import { CurrentQuestion } from "./views/current-question";
import ChartRawConsumption from "./views/chart-raw-consumption";
import ChartRawExpenditure from "./views/chart-raw-expenditure";
import ChartBeliefs from "./views/chart-beliefs";

export default function AdaptiveTaskGenericPage({
    Reinforcer,
}: {
    Reinforcer: string;
}) {
    const { POSMGeneric, setPOSMGeneric, ResponseCount, SetSurveyUpdate } = use(StateContext);

    useEffect(() => {
        const prices_under_1 = [0.1, 0.5];
        const prices_under_10 = Array.from({ length: 9 }, (_, i) => i * 1 + 1); // Generates [1, 2, 3, ..., 9]
        const prices_above_10 = Array.from({ length: 10 }, (_, i) => i + 10); // Generates [10, 11, 12, ..., 19]

        const DEFAULT_PRICES = [
            ...prices_under_1,
            ...prices_under_10,
            ...prices_above_10,
        ];

        POSMGeneric.init(DEFAULT_PRICES, 0.5);

        const POSM_1 = POSMGeneric;

        setPOSMGeneric(POSM_1);
        SetSurveyUpdate(new Date());
    }, [Reinforcer]);

    return (
        <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer} (${ResponseCount})`}>
            <CurrentQuestion />

            <div className="grid grid-cols-3 w-full gap-4 min-h-100 bg-white">
                <ChartBeliefs POSM={POSMGeneric} />

                <ChartRawExpenditure POSM={POSMGeneric} />

                <ChartRawConsumption POSM={POSMGeneric} />

            </div>
        </ContentWrapper>
    );
}