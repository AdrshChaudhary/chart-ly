
"use client"

import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ColumnInfo } from '@/lib/chart-utils';
import { findKey } from '@/lib/chart-utils';
import * as React from 'react';

interface ChartProps {
    data: any[];
    columnInfo: ColumnInfo[];
}

const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))'
];

export default function PieChartComponent({ data, columnInfo }: ChartProps) {
    const nameKey = findKey(columnInfo, 'categorical');
    const valueKey = findKey(columnInfo, 'numeric');

    if (!nameKey || !valueKey) {
        return <div className="text-center text-muted-foreground p-4">Pie chart requires a text column and a numeric column.</div>;
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
        return Object.entries(result).map(([name, value]) => ({ name, value }));
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
