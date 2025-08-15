"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { detectColumnTypes, getChartSuggestions } from '@/lib/chart-utils';
import LineChartComponent from './charts/line-chart';
import BarChartComponent from './charts/bar-chart';
import PieChartComponent from './charts/pie-chart';

interface ChartGridProps {
  data: any[];
}

const NoChartsAvailable = () => (
    <Card className="col-span-1 md:col-span-2 flex flex-col items-center justify-center text-center p-8">
        <CardHeader>
            <CardTitle>Cannot Generate Charts</CardTitle>
            <CardDescription>
                We couldn&apos;t find compatible columns in your data to generate charts.
                Please ensure your file contains at least one text/date column and one numeric column.
            </CardDescription>
        </CardHeader>
    </Card>
)

export function ChartGrid({ data }: ChartGridProps) {
  const { suggestions, columnInfo } = React.useMemo(() => {
    const detectedColumns = detectColumnTypes(data);
    return {
      suggestions: getChartSuggestions(detectedColumns),
      columnInfo: detectedColumns
    };
  }, [data]);

  if (suggestions.length === 0) {
    return <NoChartsAvailable />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {suggestions.includes('line') && (
        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChartComponent data={data} columnInfo={columnInfo} />
          </CardContent>
        </Card>
      )}
      {suggestions.includes('bar') && (
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={data} columnInfo={columnInfo} />
          </CardContent>
        </Card>
      )}
      {suggestions.includes('pie') && (
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={data} columnInfo={columnInfo} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
