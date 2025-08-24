
"use client"

import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ChartSuggestion } from '@/lib/chart-utils';
import * as React from 'react';

interface ChartProps {
    data: any[];
    config: ChartSuggestion;
}

const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))'
];

const MAX_SLICES = 6; // Limit the number of pie slices for readability

export default function PieChartComponent({ data, config }: ChartProps) {
    const { nameKey, valueKey } = config;

    if (!nameKey || !valueKey) {
        return <div className="text-center text-muted-foreground p-4">Pie chart configuration is invalid.</div>;
    }
    
    const aggregatedData = React.useMemo(() => {
        if (!nameKey || !valueKey) return [];
        const result: {[key: string]: number} = {};
        data.forEach(item => {
            const name = item[nameKey];
            const value = parseFloat(item[valueKey]);
            if (name && !isNaN(value)) {
                if(result[name]) {
                    result[name] += value;
                } else {
                    result[name] = value;
                }
            }
        });
        
        let processedData = Object.entries(result).map(([name, value]) => ({ name, value }));

        // If there are too many slices, group the smallest ones into "Other"
        if (processedData.length > MAX_SLICES) {
            processedData.sort((a, b) => b.value - a.value);
            const topSlices = processedData.slice(0, MAX_SLICES - 1);
            const otherSlices = processedData.slice(MAX_SLICES - 1);
            const otherValue = otherSlices.reduce((sum, slice) => sum + slice.value, 0);
            return [...topSlices, { name: 'Other', value: otherValue }];
        }

        return processedData;

    }, [data, nameKey, valueKey]);


    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    <Pie data={aggregatedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {aggregatedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

    