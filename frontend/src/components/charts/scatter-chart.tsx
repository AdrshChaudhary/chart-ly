
"use client"

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartSuggestion } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    config: ChartSuggestion;
}

export default function ScatterChartComponent({ data, config }: ChartProps) {
    const { xAxis: xAxisKey, yAxis: yAxisKeys } = config;

    if (!xAxisKey || !yAxisKeys || yAxisKeys.length === 0) {
        return <div className="text-center text-muted-foreground p-4">Scatter chart configuration is invalid.</div>;
    }

    const yAxisKey = yAxisKeys[0];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                        type="number" 
                        dataKey={xAxisKey} 
                        name={xAxisKey} 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={true}
                        label={{ value: xAxisKey, position: 'insideBottom', offset: -10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis 
                        type="number" 
                        dataKey={yAxisKey} 
                        name={yAxisKey} 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false} 
                        axisLine={true}
                        label={{ value: yAxisKey, angle: -90, position: 'insideLeft', offset: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                     <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}} verticalAlign="top" height={36}/>
                    <Scatter name={`${yAxisKey} vs ${xAxisKey}`} data={data} fill="hsl(var(--primary))" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
