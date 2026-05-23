import { AdaptiveDemandContext } from "#/components/context/adaptive-demand-context.tsx";
import { use, useMemo } from "react";
import { Chart, type AxisOptions } from "react-charts";

type BeliefMapping = {
    level: number,
    beliefs: number,
}

type Series = {
    label: string,
    data: BeliefMapping[]
}

export default function ChartBeliefs() {
    const { POSM } = use(AdaptiveDemandContext);

    const data: Series[] = [
        {
            label: 'React Charts',
            data: POSM.levels.map((_, index) => ({
                level: POSM.levels[index],
                beliefs: POSM.beliefsCumulative[index],
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
            scaleType: 'log',
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

    return <div className="bg-white">{POSM.responses.length > 0 && (
        <Chart
            className="tick-color"
            options={{
                data,
                primaryAxis,
                secondaryAxes,
            }}
        />
    )}</div>
}