"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ColumnInfo } from '@/lib/chart-utils';
import { findKey } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    columnInfo: ColumnInfo[];
}

export default function BarChartComponent({ data, columnInfo }: ChartProps) {
    const categoryKey = findKey(columnInfo, 'categorical');
    const valueKey = findKey(columnInfo, 'numeric');

    if (!categoryKey || !valueKey) {
        return <div className="text-center text-muted-foreground p-4">Bar chart requires a text column and a numeric column.</div>;
    }

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
                    <Bar dataKey={valueKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
