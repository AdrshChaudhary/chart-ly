
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { BrainCircuit } from 'lucide-react';

interface AIInsightsProps {
  data: any[];
}

const dummyInsight = `
- **Total Sales Analysis**: The total sales for the period is **$38,750**. The highest sales were recorded in December 2023 ($5,800), and the lowest were in May 2023 ($1,890). There is a clear upward trend in sales towards the end of the year, suggesting strong seasonal performance or business growth.
- **Profitability Insights**: The total profit stands at **$51,806**. The most profitable month was March 2023 ($9,800), which surprisingly did not have the highest sales, indicating a high-margin transaction. The profit margin is inconsistent across months.
- **Regional Performance**: The West and South regions are the top performers in terms of both sales and user acquisition. The East region shows potential for growth but currently lags behind.
- **User Growth**: User count has been steadily increasing, starting from 100 in January and reaching 230 by December, which is a 130% increase over the year.
`;

export function AIInsights({ data }: AIInsightsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<string | null>(null);

  const handleGenerateInsights = () => {
    setIsLoading(true);
    setInsights(null);
    // Simulate an API call to an AI service
    setTimeout(() => {
      // In a real application, you would make an API call here
      // with the `data` and get the insights back.
      setInsights(dummyInsight);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='flex items-center gap-3'>
          <BrainCircuit className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>Click the button to generate an analysis of your data.</CardDescription>
          </div>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Insights'}
        </Button>
      </CardHeader>
      {(isLoading || insights) && (
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: insights ? insights.replace(/\n/g, '<br />') : '' }} />
          )}
        </CardContent>
      )}
    </Card>
  );
}
