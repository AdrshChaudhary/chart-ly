
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ColumnInfo } from '@/lib/chart-utils';
import { findKey, isDate } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    columnInfo: ColumnInfo[];
}

export default function LineChartComponent({ data, columnInfo }: ChartProps) {
    const dateKey = findKey(columnInfo, 'date');
    const categoryKey = findKey(columnInfo, 'categorical');
    const xAxisKey = dateKey || categoryKey;
    const valueKey = findKey(columnInfo, 'numeric');

    if (!xAxisKey || !valueKey) {
        return <div className="text-center text-muted-foreground p-4">Line chart requires a date/text column and a numeric column.</div>;
    }

    const formattedData = data.map(item => {
        const newItem = {...item};
        if (dateKey && isDate(newItem[dateKey])) {
            newItem[dateKey] = new Date(item[dateKey]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                    <Line type="monotone" dataKey={valueKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
