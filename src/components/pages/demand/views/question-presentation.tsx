import { StateContext } from "#/components/context/state-context.tsx";
import { use, useState } from "react";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { evaluate_threshold } from "#/lib/helpers/thresholds.ts";
import { NotifyParentAdaptiveDemand } from "#/lib/notify/notify-parent.ts";
import PriceGroupingView from "./price-grouping-view";

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
    const [parsedExpend, setParsedExpend] = useState<number>(-1);

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

        const evaluate_state_terminate = evaluate_threshold(POSMGeneric);

        setResponseCount(POSMGeneric.responses.length);

        setParsedExpend(-1);

        if (evaluate_state_terminate) {
            alert('done')

            NotifyParentAdaptiveDemand(POSMGeneric, true);
        }
    }

    return (
        <div className="flex flex-col w-full gap-1 py-1">
            <PriceGroupingView PriceValues={distinctPriceValues} ordering={ordering} POSMGeneric={POSMGeneric}>
                <div className="flex flex-row justify-between gap-4 w-full items-center">
                    <p className="grow underline font-semibold">
                        How many would you purchase at a price of ${POSMGeneric.prediction}?
                    </p>

                    {
                        parsedExpend > 0 && <p className="text-sm text-gray-500">
                            Cost: ${parsedExpend.toFixed(2)}
                        </p>
                    }

                    <Button
                        className="max-w-16"
                        onClick={submitResponse}
                    >
                        Save
                    </Button>
                    <Input
                        type="number"
                        min={0}
                        step={1}
                        value={entryValue}
                        inputMode="numeric"
                        pattern="\d*"
                        autoFocus
                        onChange={(e) => {
                            const parsedString = e.currentTarget.value.split(".")[0];


                            setEntryValue(parsedString);

                            const parsedNumber = parseInt(parsedString);
                            const costNumber = POSMGeneric.prediction * parsedNumber;

                            setParsedExpend(costNumber ? costNumber : -1);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submitResponse();
                            }

                            if (e.key === ".") return e.preventDefault();
                        }}
                        className="max-w-16"
                    />

                </div>
            </PriceGroupingView>
        </div>
    );
}