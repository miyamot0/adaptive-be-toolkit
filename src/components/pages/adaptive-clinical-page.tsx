import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { evaluate_threshold } from "@/lib/helpers/thresholds";
import { use, useEffect, useMemo, useState } from "react";
import { PastQuestion } from "./past-question";
import { ContentWrapper } from "../layout/content-wrapper";
import { StateContext } from "../context/state-context";
import { Chart, type AxisOptions } from "react-charts";

function CurrentQuestion({ ShowPastQuestions = true }: { ShowPastQuestions?: boolean }) {
    const { POSMGeneric, setPOSMGeneric, route, routes, setRoute } =
        use(StateContext);
    const [entryValue, setEntryValue] = useState("");

    if (POSMGeneric.prediction === -1) return null;

    const ordering = Array.from(POSMGeneric.responses)
        .sort((a, b) => a.Price - b.Price)
        .map((x, index) => {
            return {
                ...x,
                index,
            };
        });

    const cheaper_questions = ordering.filter(
        (x) => x.Price <= POSMGeneric.prediction
    );
    const more_expensive_questions = ordering.filter(
        (x) => x.Price > POSMGeneric.prediction
    );

    return (
        <div className="flex flex-col w-full gap-1">
            {ShowPastQuestions === true && cheaper_questions.map((x, index) => (
                <PastQuestion
                    Record={x}
                    key={`pre_q_${index}`}
                    Query={`How many would you purchase at a price of ${x.Price}?`}
                />
            ))}
            <div className="flex flex-row justify-between gap-4 items-center">
                <p className="grow underline font-semibold">
                    How many would you purchase at a price of ${POSMGeneric.prediction}?
                </p>
                <Input
                    type="number"
                    min={0}
                    value={entryValue}
                    onChange={(e) => {
                        setEntryValue(e.currentTarget.value);
                    }}
                    className="max-w-16"
                ></Input>
                <Button
                    className="max-w-16"
                    onClick={() => {
                        if (entryValue === "") return;
                        const quantity_endorsed = parseInt(entryValue);
                        const expended = POSMGeneric.prediction * quantity_endorsed;

                        POSMGeneric.iterate(expended);

                        setPOSMGeneric(POSMGeneric);
                        setEntryValue("");

                        const lookBack = -3;

                        const getPastExpend = POSMGeneric.responses.slice(lookBack);
                        const currentPeakExpend = POSMGeneric.max_expend;

                        if (getPastExpend.length > 0) {
                            const peakExpendAve = getPastExpend.reduce((acc, curr) => acc + curr.Revenue, 0) / getPastExpend.length;

                            const pctChange = ((currentPeakExpend - peakExpendAve) / peakExpendAve) * 100;

                            console.log(`Current Peak: $${currentPeakExpend.toFixed(2)}, Ave Peak: $${peakExpendAve.toFixed(2)}, Pct Change: ${pctChange.toFixed(2)}%`);
                        }


                        const evaluate_state_terminate = evaluate_threshold(POSMGeneric);

                        if (evaluate_state_terminate) {
                            const index_in_routes = routes.indexOf(route);
                            const next_route = routes[index_in_routes + 1];

                            setRoute(next_route);
                        }
                    }}
                >
                    Save
                </Button>
            </div>

            {ShowPastQuestions === true && more_expensive_questions.map((x, index) => (
                <PastQuestion
                    Record={x}
                    key={`post_q_${index}`}
                    Query={`How many would you purchase at a price of ${x.Price}?`}
                />
            ))}
        </div>
    );
}

type BeliefMapping = {
    level: number,
    beliefs: number,
}

type Series = {
    label: string,
    data: BeliefMapping[]
}

export default function AdaptiveTaskGenericPage({
    Reinforcer,
}: {
    Reinforcer: string;
}) {
    const { POSMGeneric, setPOSMGeneric } =
        use(StateContext);

    useEffect(() => {
        const prices_under_1 = [0.1, 0.5];
        const prices_under_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const prices_above_10 = Array.from({ length: 10 }, (_, i) => i + 10);

        const DEFAULT_PRICES = [
            ...prices_under_1,
            ...prices_under_10,
            ...prices_above_10,
        ];

        console.log(DEFAULT_PRICES);

        POSMGeneric.init(DEFAULT_PRICES);
        const POSM_1 = POSMGeneric;

        console.log(POSMGeneric);


        setPOSMGeneric(POSM_1);
    }, [Reinforcer]);

    //console.log(POSMGeneric);
    const currentSum = POSMGeneric.beliefs.reduce((acc, curr) => acc + curr, 0);

    const data: Series[] = [
        {
            label: 'React Charts',
            data: POSMGeneric.levels.map((level, index) => ({
                level: POSMGeneric.levels[index],
                beliefs: POSMGeneric.beliefsCumulative[index],
            })),
        }
    ]

    const primaryAxis = useMemo(
        (): AxisOptions<BeliefMapping> => ({
            getValue: datum => datum.level,
            styles: {
                tick: {
                    fontSize: '12px',
                    fill: '#333',
                    fontWeight: 'bold',
                },
            },
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<BeliefMapping>[] => [
            {
                getValue: datum => datum.beliefs,
                styles: {
                    tick: {
                        fontSize: '12px',
                        fill: '#333',
                        fontWeight: 'bold',
                    },
                },
            },
        ],
        []
    )

    return (
        <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer}`}>
            {false && JSON.stringify(POSMGeneric, null, 2)}

            <CurrentQuestion ShowPastQuestions={true} />

            <div className="flex flex-col w-full gap-4 min-h-[400px] bg-white">
                {POSMGeneric.responses.length > 0 && (
                    <Chart
                        className="tick-color"
                        options={{
                            data,
                            primaryAxis,
                            secondaryAxes,
                        }}
                    />
                )}
            </div>
        </ContentWrapper>
    );
}