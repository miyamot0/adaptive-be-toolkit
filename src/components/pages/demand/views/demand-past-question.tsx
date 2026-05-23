import type { PastDemandQuestionType } from "#/types/demand.ts";
import { Input } from "@/components/ui/input";

export const DemandPastQuestion = ({
    Record,
    Query,
}: {
    Record: PastDemandQuestionType;
    Query: string;
}) => {
    return (
        <div className="hidden nth-last-[-n+2]:flex flex-col w-full gap-4">
            <div className="py-0.5 flex flex-row justify-between gap-4 items-center">
                <p className="grow text-gray-400">{Query}</p>
                {
                    Record.Quantity > 0 && <p className="text-sm text-gray-500">
                        Cost: ${Record.Revenue.toFixed(2)}
                    </p>
                }

                <Input
                    type="number"
                    min={0}
                    value={Record.Quantity}
                    disabled
                    className="max-w-16 disabled opacity-50"
                ></Input>

            </div>
        </div>
    );
};