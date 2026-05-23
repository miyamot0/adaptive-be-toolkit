import { StateContext } from "#/components/context/state-context.tsx";
import { use, useState } from "react";
import { PastQuestion } from "../common/past-question";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { evaluate_threshold } from "#/lib/helpers/thresholds.ts";
import PriceGroupingView from "./views/price-grouping-view";
import { NotifyParentAdaptiveDemand } from "#/lib/notify/notify-parent.ts";

export type ResponseOutput = {
    Price: number;
    Quantity: number;
    Revenue: number;
    index: number;
}

export function QuestionPresentation() {
    const { POSMGeneric, setPOSMGeneric, setResponseCount } =
        use(StateContext);
    const [entryValue, setEntryValue] = useState("");

    if (POSMGeneric.prediction === -1) return null;

    const ordering: ResponseOutput[] = Array.from(POSMGeneric.responses)
        .sort((a, b) => a.Price - b.Price)
        .map((x, index) => {
            return {
                ...x,
                index,
            };
        });

    const priceValues = ordering.map((x) => x.Price);
    const distinctPriceValues = Array.from(new Set([...priceValues, POSMGeneric.prediction])).sort((a, b) => a - b);

    function submitResponse() {
        if (entryValue === "") return;
        const quantity_endorsed = parseInt(entryValue);
        const expended = POSMGeneric.prediction * quantity_endorsed;

        POSMGeneric.iterate(expended);

        setPOSMGeneric(POSMGeneric);
        setEntryValue("");

        //const lookBack = -3;

        //const getPastExpend = POSMGeneric.responses.slice(lookBack);
        //const currentPeakExpend = POSMGeneric.max_expend;



        const evaluate_state_terminate = evaluate_threshold(POSMGeneric);

        setResponseCount(POSMGeneric.responses.length);


        if (evaluate_state_terminate) {
            alert('done')

            NotifyParentAdaptiveDemand(POSMGeneric, true);
            //const index_in_routes = routes.indexOf(route);
            // / const next_route = routes[index_in_routes + 1];

            //setRoute(next_route);
        }
    }

    return (
        <div className="flex flex-col w-full gap-1 py-1">
            <PriceGroupingView PriceValues={distinctPriceValues} ordering={ordering} POSMGeneric={POSMGeneric}>
                <div className="flex flex-row justify-between gap-4 w-full items-center">
                    <p className="grow underline font-semibold">
                        How many would you purchase at a price of ${POSMGeneric.prediction}?
                    </p>
                    <Button
                        className="max-w-16"
                        onClick={submitResponse}
                    >
                        Save
                    </Button>
                    <Input
                        type="number"
                        min={0}
                        value={entryValue}
                        autoFocus
                        onChange={(e) => {
                            setEntryValue(e.currentTarget.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submitResponse();
                            }
                        }}
                        className="max-w-16"
                    />

                </div>
            </PriceGroupingView>
        </div>
    );
}