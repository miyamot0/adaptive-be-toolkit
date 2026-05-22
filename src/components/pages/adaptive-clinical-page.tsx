import { use, useEffect, useMemo } from "react";
import { ContentWrapper } from "../layout/content-wrapper";
import { StateContext } from "../context/state-context";
import { Chart, type AxisOptions } from "react-charts";
import { CurrentQuestion } from "./views/current-question";


type BeliefMapping = {
    level: number,
    beliefs: number,
}

type RawDataMapping = {
    x: number,
    y: number,
}

type Series = {
    label: string,
    data: BeliefMapping[]
}

type SeriesRaw = {
    label: string,
    data: RawDataMapping[]
}

const max = 20

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

        POSMGeneric.init(DEFAULT_PRICES, 0.5);
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


    const dataRaw: SeriesRaw[] = [
        {
            label: 'React Charts',
            data: POSMGeneric.responses.map((response, index) => ({
                x: response.Price,
                y: response.Revenue,
            })),
        }
    ]

    const primaryAxisRaw = useMemo(
        (): AxisOptions<RawDataMapping> => ({
            getValue: datum => datum.x,
            styles: {
                tick: {
                    fontSize: '12px',
                    fill: '#333',
                    fontWeight: 'bold',
                },
            },
            min: 0,
            max: max,
        }),
        []
    )

    const secondaryAxesRaw = useMemo(
        (): AxisOptions<RawDataMapping>[] => [
            {
                getValue: datum => datum.y,
                styles: {
                    tick: {
                        fontSize: '12px',
                        fill: '#333',
                        fontWeight: 'bold',
                    },
                },
                elementType: 'bubble',
                min: 0,
            },
        ],
        []
    )

    return (
        <ContentWrapper Title={`Hypothetical Purchase Task for ${Reinforcer}`}>
            {false && JSON.stringify(POSMGeneric, null, 2)}

            <CurrentQuestion ShowPastQuestions={true} />

            <div className="grid grid-cols-2 w-full gap-4 min-h-100 bg-white">
                <div>{POSMGeneric.responses.length > 0 && (
                    <Chart
                        className="tick-color"
                        options={{
                            data,
                            primaryAxis,
                            secondaryAxes,
                        }}
                    />
                )}</div>

                <div>{POSMGeneric.responses.length > 0 && (
                    <Chart
                        className="tick-color"
                        options={{
                            data: dataRaw,
                            primaryAxis: primaryAxisRaw,
                            secondaryAxes: secondaryAxesRaw,

                        }}

                    />
                )}</div>
            </div>
        </ContentWrapper>
    );
}