import { use } from "react";
import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { Button } from "#/components/ui/button.tsx";
import { NotifyParentAdaptiveDiscounting } from "#/components/pages/discounting/helpers/discounting-notify-parent.ts";
import { CommonTaskContext } from "#/components/context/common-task-context.tsx";

export type ResponseOutput = {
  Price: number;
  Quantity: number;
  Revenue: number;
  index: number;
};

export function DiscountingQuestionPresentation({
  Reinforcer,
}: {
  Reinforcer: string;
}) {
  const { POSM, setPOSM } = use(AdaptiveDiscountingContext);
  const { setResponseCount, setHasFinished } = use(CommonTaskContext);

  if (POSM.prediction === -1) return null;

  function submitResponse(waited: boolean) {
    POSM.iterate(waited ? 1 : 0);
    setPOSM(POSM);

    const evaluate_state_terminate = POSM.evaluate_threshold();

    setResponseCount(POSM.responses.length);

    if (evaluate_state_terminate) {
      NotifyParentAdaptiveDiscounting(POSM, true);
      setHasFinished(true);
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 py-1 items-center">
      <h1 className="font-bold py-6 text-2xl text-center">
        Each of these options vary in terms of reward size and delay. <br />
        Which of the following would you most prefer?
      </h1>

      <div
        key={POSM.turn}
        className="flex flex-row justify-between gap-4 w-full items-center opacity-100 transition-opacity duration-500 starting:opacity-0"
      >
        <Button
          variant={"outline"}
          className="w-58 h-58 text-xl cursor-auto"
          onClick={() => submitResponse(false)}
        >
          I would prefer to have
          <br />
          {POSM.ssr} {Reinforcer}
          <br />
          RIGHT NOW
        </Button>
        <span className="text-gray-500 text-2xl">OR</span>
        <Button
          variant={"outline"}
          className="w-58 h-58 text-xl cursor-auto"
          onClick={() => submitResponse(true)}
        >
          I would prefer to <br />
          wait {POSM.prediction} days for
          <br />
          {POSM.llr} {Reinforcer}
        </Button>
      </div>
    </div>
  );
}
