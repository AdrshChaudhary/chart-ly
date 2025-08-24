
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChartSuggestion, ColumnInfo } from '@/lib/chart-utils';
import LineChartComponent from './charts/line-chart';
import BarChartComponent from './charts/bar-chart';
import PieChartComponent from './charts/pie-chart';
import ScatterChartComponent from './charts/scatter-chart';
import RadarChartComponent from './charts/radar-chart';
import AreaChartComponent from './charts/area-chart';
import { Skeleton } from './ui/skeleton';

interface ChartGridProps {
  data: any[];
  suggestions: ChartSuggestion[];
  isLoading: boolean;
}

const NoChartsAvailable = () => (
    <Card className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center p-8">
        <CardHeader>
            <CardTitle>Cannot Generate Charts</CardTitle>
            <CardDescription>
                We couldn&apos;t find compatible columns in your data to generate charts, or the filtered data is empty.
                Please ensure your file contains at least one text/date column and one numeric column.
            </CardDescription>
        </CardHeader>
    </Card>
)

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
    </div>
)

const chartComponentMap = {
    line: LineChartComponent,
    bar: BarChartComponent,
    pie: PieChartComponent,
    scatter: ScatterChartComponent,
    radar: RadarChartComponent,
    area: AreaChartComponent
};

export function ChartGrid({ data, suggestions, isLoading }: ChartGridProps) {

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (data.length > 0 && suggestions.length === 0 && !isLoading) {
    return <NoChartsAvailable />;
  }
  
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {suggestions.map((suggestion, index) => {
          const ChartComponent = chartComponentMap[suggestion.chartType];
          if (!ChartComponent) return null;

          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{suggestion.title}</CardTitle>
                <CardDescription>{suggestion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartComponent 
                  data={data}
                  config={suggestion}
                />
              </CardContent>
            </Card>
          )
      })}
    </div>
  );
}
