import type { POSM } from "@/lib/posm/posm";
import { useMemo } from "react";
import { Chart, type AxisOptions } from "react-charts";

type RawDataMapping = {
    x: number,
    y: number,
}

type SeriesRaw = {
    label: string,
    data: RawDataMapping[]
}

export default function ChartRawExpenditure({ POSM }: { POSM: POSM }) {


    const data: SeriesRaw[] = [
        {
            label: 'React Charts',
            data: POSM.responses.map((response, index) => ({
                x: response.Price,
                y: response.Revenue,
            })),
        }
    ]

    const primaryAxis = useMemo(
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
        }),
        []
    )

    const secondaryAxes = useMemo(
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