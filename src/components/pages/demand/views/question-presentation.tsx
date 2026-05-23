import { use, useState } from "react";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { evaluate_threshold } from "#/lib/helpers/thresholds.ts";
import { NotifyParentAdaptiveDemand } from "#/lib/helpers/notify/demand-notify-parent.ts";
import PriceGroupingView from "./price-grouping-view";
import { AdaptiveDemandContext } from "#/components/context/adaptive-demand-context.tsx";

export type ResponseOutput = {
    Price: number;
    Quantity: number;
    Revenue: number;
    index: number;
}

export function QuestionPresentation() {
    const { POSM, setPOSM, setResponseCount } = use(AdaptiveDemandContext);

    const [entryValue, setEntryValue] = useState("");
    const [parsedExpend, setParsedExpend] = useState<number>(-1);

    if (POSM.prediction === -1) return null;

    const ordering: ResponseOutput[] = Array.from(POSM.responses)
        .sort((a, b) => a.Price - b.Price)
        .map((x, index) => {
            return {
                ...x,
                index,
            };
        });

    const priceValues = ordering.map((x) => x.Price);
    const distinctPriceValues = Array.from(new Set([...priceValues, POSM.prediction])).sort((a, b) => a - b);

    function submitResponse() {
        if (entryValue === "") return;
        const quantity_endorsed = parseInt(entryValue);
        const expended = POSM.prediction * quantity_endorsed;

        POSM.iterate(expended);

        setPOSM(POSM);
        setEntryValue("");

        const evaluate_state_terminate = evaluate_threshold(POSM);

        console.log("evaluate_state_terminate", evaluate_state_terminate);

        setResponseCount(POSM.responses.length);

        setParsedExpend(-1);

        if (evaluate_state_terminate) {
            alert('done')

            NotifyParentAdaptiveDemand(POSM, true);
        }
    }

    return (
        <div className="flex flex-col w-full gap-1 py-1">
            <PriceGroupingView PriceValues={distinctPriceValues} ordering={ordering} POSMGeneric={POSM}>
                <div className="flex flex-row justify-between gap-4 w-full items-center">
                    <p className="grow underline font-semibold">
                        How many would you purchase at a price of ${POSM.prediction}?
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
                            const costNumber = POSM.prediction * parsedNumber;

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