/** ChartEntropy
 *
 * Visualizes per-trial belief entropy (nats) across the discounting task.
 * A downward slope indicates beliefs are concentrating around the ED50 estimate;
 * a plateau signals convergence and that additional trials are unlikely to
 * contribute new information. Maximum entropy for N levels is ln(N);
 * minimum is 0 (complete certainty about a single level).
 */
import { AdaptiveDiscountingContext } from "#/components/context/adaptive-discounting-context.tsx";
import { use, useMemo } from "react";
import { Chart, type AxisOptions } from "react-charts";

type EntropyMapping = {
    trial: number;
    entropy: number;
}

type SeriesEntropy = {
    label: string;
    data: EntropyMapping[];
}

export default function ChartEntropy() {
    const { POSM } = use(AdaptiveDiscountingContext);

    const data: SeriesEntropy[] = [
        {
            label: 'Belief Entropy',
            data: POSM.responses.map((response, index) => ({
                trial: index + 1,
                entropy: response.Entropy,
            })),
        }
    ]

    const primaryAxis = useMemo(
        (): AxisOptions<EntropyMapping> => ({
            getValue: datum => datum.trial,
            styles: {
                tick: {
                    fontSize: '12px',
                    fill: '#333',
                    fontWeight: 'bold',
                },
            },
            scaleType: 'linear',
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<EntropyMapping>[] => [
            {
                getValue: datum => datum.entropy,
                styles: {
                    tick: {
                        fontSize: '12px',
                        fill: '#333',
                        fontWeight: 'bold',
                    },
                },
                elementType: 'line',
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
