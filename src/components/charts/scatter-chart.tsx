"use client"

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ColumnInfo } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    columnInfo: ColumnInfo[];
}

export default function ScatterChartComponent({ data, columnInfo }: ChartProps) {
    const numericColumns = columnInfo.filter(c => c.type === 'numeric');

    if (numericColumns.length < 2) {
        return <div className="text-center text-muted-foreground p-4">Scatter chart requires at least two numeric columns.</div>;
    }

    const xAxisKey = numericColumns[0].name;
    const yAxisKey = numericColumns[1].name;

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
                        label={{ value: xAxisKey, position: 'bottom', offset: 0, fill: "hsl(var(--muted-foreground))" }}
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
