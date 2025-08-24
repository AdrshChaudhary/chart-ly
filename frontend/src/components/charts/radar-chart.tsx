
"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartSuggestion } from '@/lib/chart-utils';
import * as React from 'react';

interface ChartProps {
    data: any[];
    config: ChartSuggestion;
}

const chartColors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const MAX_RADAR_ITEMS = 7;

export default function RadarChartComponent({ data, config }: ChartProps) {
    const { categoryKey, yAxis: numericKeys } = config;

    if (!categoryKey || !numericKeys || numericKeys.length < 2) {
        return <div className="text-center text-muted-foreground p-4">Radar chart configuration is invalid.</div>;
    }
    
    // Aggregate data and limit for readability
    const chartData = React.useMemo(() => {
        const aggregated: {[key: string]: any} = {};
        
        data.forEach(item => {
            const category = item[categoryKey];
            if (!category) return;
            
            if (!aggregated[category]) {
                aggregated[category] = { [categoryKey]: category, count: 0 };
                 numericKeys.forEach(key => aggregated[category][key] = 0);
            }
            
            numericKeys.forEach(key => {
                 aggregated[category][key] += (parseFloat(item[key]) || 0);
            });
            aggregated[category].count++;
        });
        
        // Average the values
        Object.values(aggregated).forEach(agg => {
            numericKeys.forEach(key => {
                agg[key] = agg[key] / agg.count;
            });
        });

        // Take top N items by first numeric key for stable sorting
        return Object.values(aggregated)
          .sort((a,b) => b[numericKeys[0]] - a[numericKeys[0]])
          .slice(0, MAX_RADAR_ITEMS);

    }, [data, categoryKey, numericKeys]);

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

    