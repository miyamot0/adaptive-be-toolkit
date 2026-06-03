import type { DemandAgent } from "#/lib/posm/demand/demand-agent.ts";
import type { PastDemandQuestionType } from "#/types/demand/demand-response-output.ts";
import { DemandPastQuestion } from "./demand-past-question";

type Props = {
    PriceValues: number[];
    ordering: PastDemandQuestionType[];
    POSMGeneric: DemandAgent;
    children: React.ReactNode;
}

export default function PriceGroupingView({ PriceValues, ordering, POSMGeneric, children }: Props) {
    return PriceValues.map((x, index) => {
        const isAtCurrentPrediction = x === POSMGeneric.prediction;
        const priorResponsesAtPrice = ordering.filter((q) => q.Price === x);

        return <div key={`price_${index}`} className="flex flex-col justify-between gap-0 items-center border rounded px-2 py-1">
            {
                priorResponsesAtPrice.length > 0 && priorResponsesAtPrice.slice(-1).map((x, index) => (
                    <DemandPastQuestion
                        Record={x}
                        key={`pre_q_${index}`}
                        Query={`How many would you purchase at a price of ${x.Price}?`}
                    />
                ))
            }

            {
                isAtCurrentPrediction && children
            }
        </div>
    })

}