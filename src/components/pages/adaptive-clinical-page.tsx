import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { evaluate_threshold } from "@/lib/helpers/thresholds";
import { use, useEffect, useMemo, useState } from "react";
import { PastQuestion } from "./past-question";
import { ContentWrapper } from "../layout/content-wrapper";
import { StateContext } from "../context/state-context";
import { Chart, type AxisOptions } from "react-charts";
import { CurrentQuestion } from "./views/current-question";


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

        POSMGeneric.init(DEFAULT_PRICES);
        const POSM_1 = POSMGeneric;


        setPOSMGeneric(POSM_1);
    }, [Reinforcer]);

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

            <div className="flex flex-col w-full gap-4 min-h-100 bg-white">
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