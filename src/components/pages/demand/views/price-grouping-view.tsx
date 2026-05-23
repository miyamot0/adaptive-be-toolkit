import type { POSM } from "#/lib/posm/posm.ts";
import { PastQuestion } from "../../common/past-question";
import type { ResponseOutput } from "../question-presentation";

type Props = {
    PriceValues: number[];
    ordering: ResponseOutput[];
    POSMGeneric: POSM;
    children: React.ReactNode;
}

export default function PriceGroupingView({ PriceValues, ordering, POSMGeneric, children }: Props) {
    return PriceValues.map((x, index) => (
        <div key={`price_${index}`} className="flex flex-col justify-between gap-0 items-center border rounded px-2 py-1">
            {
                ordering.filter(
                    (q) => q.Price === x
                ).map((x, index) => (
                    <PastQuestion
                        Record={x}
                        key={`pre_q_${index}`}
                        Query={`How many would you purchase at a price of ${x.Price}?`}
                    />
                ))
            }

            {
                x === POSMGeneric.prediction && children
            }
        </div>
    ))

}