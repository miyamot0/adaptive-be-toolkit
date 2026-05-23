import { AdaptiveDemandContext } from "#/components/context/adaptive-demand-context.tsx";
import { use, useMemo } from "react";
import { Chart, type AxisOptions } from "react-charts";

type RawDataMapping = {
    x: number,
    y: number,
}

type SeriesRaw = {
    label: string,
    data: RawDataMapping[]
}

export default function ChartRawConsumption() {
    const { POSM } = use(AdaptiveDemandContext);

    const data: SeriesRaw[] = [
        {
            label: 'React Charts',
            data: POSM.responses.map((response,) => ({
                x: response.Price,
                y: response.Quantity,
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
            min: 0.1,
            scaleType: 'log',
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