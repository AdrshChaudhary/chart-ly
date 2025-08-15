"use client"

import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ColumnInfo } from '@/lib/chart-utils';
import { findKey } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    columnInfo: ColumnInfo[];
}

const COLORS = ['#64B5F6', '#81C784', '#FFD54F', '#FF8A65', '#9575CD', '#4DB6AC'];

export default function PieChartComponent({ data, columnInfo }: ChartProps) {
    const nameKey = findKey(columnInfo, 'categorical');
    const valueKey = findKey(columnInfo, 'numeric');

    if (!nameKey || !valueKey) {
        return <div className="text-center text-muted-foreground p-4">Pie chart requires a text column and a numeric column.</div>;
    }
    
    const chartData = data.slice(0, 6).map(item => ({
        name: item[nameKey],
        value: Number(item[valueKey])
    }));


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
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
