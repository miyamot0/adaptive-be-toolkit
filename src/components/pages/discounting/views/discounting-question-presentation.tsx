import { use } from "react";
import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { Button } from "#/components/ui/button.tsx";
import { evaluate_discounting_threshold, } from "#/lib/helpers/thresholds.ts";
import { NotifyParentAdaptiveDiscounting } from "#/lib/helpers/notify/discounting-notify-parent.ts";

export type ResponseOutput = {
    Price: number;
    Quantity: number;
    Revenue: number;
    index: number;
}

export function DiscountingQuestionPresentation({ Reinforcer }: { Reinforcer: string }) {
    const { POSM, setPOSM, setResponseCount } = use(AdaptiveDiscountingContext);

    if (POSM.prediction === -1) return null;

    function submitResponse(waited: boolean) {
        POSM.iterate(waited ? 1 : 0);
        setPOSM(POSM);

        const evaluate_state_terminate = evaluate_discounting_threshold(POSM);

        setResponseCount(POSM.responses.length);

        if (evaluate_state_terminate) {
            NotifyParentAdaptiveDiscounting(POSM, true);
        }
    }

    return (
        <div className="flex flex-col w-full gap-1 py-1 items-center">
            <h2 className="font-bold py-6">Each of these options vary in terms of reward size and delay. Which of the following would you most prefer?</h2>

            <div key={POSM.turn}
                className="flex flex-row justify-between gap-4 w-full items-center opacity-100 transition-opacity duration-500 starting:opacity-0">
                <Button className="w-48 h-48" onClick={() => submitResponse(false)}>{POSM.ssr} {Reinforcer} available <br /> right now?</Button>
                <span className="text-sm text-gray-500">OR</span>
                <Button className="w-48 h-48" onClick={() => submitResponse(true)}>{POSM.llr} {Reinforcer} available <br />in {POSM.prediction} days?</Button>
            </div>
        </div>
    );
}