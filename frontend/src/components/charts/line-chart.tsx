
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartSuggestion } from '@/lib/chart-utils';
import { isDate } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    config: ChartSuggestion;
}

export default function LineChartComponent({ data, config }: ChartProps) {
    const { xAxis: xAxisKey, yAxis: yAxisKeys } = config;

    if (!xAxisKey || !yAxisKeys || yAxisKeys.length === 0) {
        return <div className="text-center text-muted-foreground p-4">Line chart configuration is invalid.</div>;
    }

    const yAxisKey = yAxisKeys[0]; // Assuming one y-axis for simplicity

    const formattedData = data.map(item => {
        const newItem = {...item};
        if (isDate(newItem[xAxisKey])) {
            newItem[xAxisKey] = new Date(item[xAxisKey]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return newItem;
    });

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Line type="monotone" dataKey={yAxisKey} name={yAxisKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
