
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIInsightsProps {
  data: any[];
}

export function AIInsights({ data }: AIInsightsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights.');
      }

      const result = await response.json();
      setInsights(result.insights);

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'An unexpected error occurred.'
        })
    } finally {
        setIsLoading(false);
    }
  };
  
  const formatInsights = (text: string | null) => {
    if (!text) return '';
    // Basic markdown to HTML conversion
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/^- (.*)/gm, '<p class="mb-2">- $1</p>') // List items with spacing
      .replace(/\n/g, '<br />'); // Newlines
  }

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
        <Button onClick={handleGenerateInsights} disabled={isLoading || data.length === 0}>
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
            <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: formatInsights(insights) }} />
          )}
        </CardContent>
      )}
    </Card>
  );
}
