"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import type { ColumnInfo } from '@/lib/chart-utils';
import { findKey } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    columnInfo: ColumnInfo[];
}

const chartColors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--chart-2))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function RadarChartComponent({ data, columnInfo }: ChartProps) {
    const categoryKey = findKey(columnInfo, 'categorical');
    const numericKeys = columnInfo.filter(c => c.type === 'numeric').map(c => c.name);

    if (!categoryKey || numericKeys.length < 2) {
        return <div className="text-center text-muted-foreground p-4">Radar chart requires one text column and at least two numeric columns.</div>;
    }

    const chartData = data.slice(0, 10); // Limit data points for readability

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    {numericKeys.slice(0, 5).map((key, index) => (
                         <Radar key={key} name={key} dataKey={key} stroke={chartColors[index % chartColors.length]} fill={chartColors[index % chartColors.length]} fillOpacity={0.6} />
                    ))}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
