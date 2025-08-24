
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartSuggestion } from '@/lib/chart-utils';
import { isDate } from '@/lib/chart-utils';

interface ChartProps {
    data: any[];
    config: ChartSuggestion;
}

export default function AreaChartComponent({ data, config }: ChartProps) {
    const { xAxis: xAxisKey, yAxis: yAxisKeys } = config;

    if (!xAxisKey || !yAxisKeys || yAxisKeys.length === 0) {
        return <div className="text-center text-muted-foreground p-4">Area chart configuration is invalid.</div>;
    }
    const yAxisKey = yAxisKeys[0];

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
                <AreaChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
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
                    <Area type="monotone" dataKey={yAxisKey} name={yAxisKey} stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
