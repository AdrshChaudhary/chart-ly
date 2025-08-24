
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartSuggestion } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    config: ChartSuggestion;
}

export default function BarChartComponent({ data, config }: ChartProps) {
    const { xAxis: categoryKey, yAxis: valueKeys } = config;

    if (!categoryKey || !valueKeys || valueKeys.length === 0) {
        return <div className="text-center text-muted-foreground p-4">Bar chart configuration is invalid.</div>;
    }
    const valueKey = valueKeys[0];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey={valueKey} name={valueKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
