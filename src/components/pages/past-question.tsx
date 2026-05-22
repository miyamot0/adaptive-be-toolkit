import type { PastQuestionType } from "#/types/survey.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PastQuestion = ({
    Record,
    Query,
}: {
    Record: PastQuestionType;
    Query: string;
}) => {
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="py-0.5 flex flex-row justify-between gap-4 items-center">
                <p className="grow text-gray-400">{Query}</p>
                {
                    //<Button className="max-w-16 disabled opacity-50">Saved</Button>
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