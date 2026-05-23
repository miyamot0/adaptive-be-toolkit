import type { POSM } from "@/lib/posm/posm";
import { useMemo } from "react";
import { Chart, type AxisOptions } from "react-charts";

type BeliefMapping = {
    level: number,
    beliefs: number,
}

type Series = {
    label: string,
    data: BeliefMapping[]
}

export default function ChartBeliefs({ POSM }: { POSM: POSM }) {

    const data: Series[] = [
        {
            label: 'React Charts',
            data: POSM.levels.map((level, index) => ({
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