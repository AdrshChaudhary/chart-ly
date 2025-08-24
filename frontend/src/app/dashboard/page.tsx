
"use client";

import * as React from 'react';
import { ChartGrid } from '@/components/chart-grid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Upload, BarChart, TrendingUp, Users, Wallet, BarChartHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { ColumnInfo, ChartSuggestion } from '@/lib/chart-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIInsights } from '@/components/ai-insights';

export type ParsedData = {
  data: any[];
  meta: {
    fields: string[];
  };
};

type KpiCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
    description?: string;
}

type ChartSuggestionResponse = {
  suggestions: ChartSuggestion[];
  columnInfo: ColumnInfo[];
  processedData?: any[];
  originalRowCount?: number;
  processedRowCount?: number;
};

function KpiCard({ title, value, icon: Icon, description }: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const [originalData, setOriginalData] = React.useState<ParsedData | null>(null);
  const [chartResponse, setChartResponse] = React.useState<ChartSuggestionResponse | null>(null);
  const [filteredData, setFilteredData] = React.useState<any[] | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [isLoadingCharts, setIsLoadingCharts] = React.useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  const fetchChartSuggestions = React.useCallback(async (data: any[]) => {
    if (data.length === 0) {
      setChartResponse(cr => cr ? {...cr, suggestions: []} : null);
      return;
    }
    setIsLoadingCharts(true);
    try {
      const response = await fetch('/api/charts/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error('Failed to get chart suggestions.');
      const result: ChartSuggestionResponse = await response.json();
      setChartResponse(result);
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not load chart suggestions.',
      });
      setChartResponse(null);
    } finally {
      setIsLoadingCharts(false);
    }
  }, [toast]);
  
  const processData = React.useCallback((data: ParsedData, name: string) => {
    setOriginalData(data);
    setFilteredData(data.data);
    setFileName(name);
    setFilters({});
    fetchChartSuggestions(data.data);
  }, [fetchChartSuggestions]);

  React.useEffect(() => {
    const newUploadDataString = sessionStorage.getItem('chartly-new-upload');
    if (newUploadDataString) {
      try {
        const decodedData = JSON.parse(newUploadDataString);
        processData(decodedData.parsedData, decodedData.fileName);
        toast({
            title: "File processed successfully!",
            description: `Showing dashboard for ${decodedData.fileName}`
        });
        sessionStorage.removeItem('chartly-new-upload');
      } catch (e) {
        console.error('Failed to parse data from sessionStorage', e);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load data from the previous page.'
        });
      }
    }
  }, [toast, processData]);

  const handleFilterChange = (columnName: string, value: string) => {
    const newFilters = { ...filters, [columnName]: value };
    if (value === 'all') {
      delete newFilters[columnName];
    }
    setFilters(newFilters);

    let dataToFilter = originalData?.data || [];
    Object.entries(newFilters).forEach(([key, val]) => {
      dataToFilter = dataToFilter.filter(row => row[key]?.toString() === val);
    });

    setFilteredData(dataToFilter);
    fetchChartSuggestions(dataToFilter);
  };
  
  const handleReset = () => {
    setOriginalData(null);
    setFilteredData(null);
    setFileName('');
    setFilters({});
    setChartResponse(null);
    router.replace('/dashboard', { scroll: false });
  };
  
  const chartData = React.useMemo(() => {
    if (!chartResponse || !filteredData) return [];
    if (chartResponse.processedData && chartResponse.processedRowCount && chartResponse.originalRowCount && chartResponse.processedRowCount < chartResponse.originalRowCount) {
        return chartResponse.processedData;
    }
    return filteredData;
  }, [chartResponse, filteredData]);


  const kpiMetrics = React.useMemo(() => {
    if (!filteredData || !chartResponse?.columnInfo) return [];
    const numericColumns = chartResponse.columnInfo.filter(c => c.type === 'numeric');
    if (numericColumns.length === 0) return [];

    return numericColumns.slice(0, 4).map(col => {
      const total = filteredData.reduce((sum, row) => sum + (Number(row[col.name]) || 0), 0);
      let value: string;
      
      if (col.name.toLowerCase().includes('sale') || col.name.toLowerCase().includes('profit') || col.name.toLowerCase().includes('expense')) {
        if (total > 1_000_000) {
          value = `$${(total / 1_000_000).toFixed(1)}M`;
        } else if (total > 1_000) {
          value = `$${(total / 1_000).toFixed(1)}K`;
        } else {
            value = `$${total.toLocaleString()}`;
        }
      }
      else {
        value = total.toLocaleString();
      }
      
      const iconMap: { [key: string]: React.ElementType } = {
          'sales': TrendingUp,
          'profit': BarChart,
          'expenses': Wallet,
          'users': Users,
      };

      return {
        title: col.name.charAt(0).toUpperCase() + col.name.slice(1),
        value: value,
        icon: iconMap[col.name.toLowerCase()] || BarChart,
        description: `Total ${col.name}`
      };
    });
  }, [filteredData, chartResponse?.columnInfo]);
  
  const slicers = React.useMemo(() => {
    if (!originalData?.data || !chartResponse?.columnInfo) return [];
    
    return chartResponse.columnInfo.filter(c => {
        if (c.type !== 'categorical') return false;
        const uniqueValues = new Set(originalData.data.map(row => row[c.name]));
        return uniqueValues.size > 1 && uniqueValues.size <= 20;
    });
  }, [chartResponse?.columnInfo, originalData?.data]);

  const showOptimizationIndicator = chartResponse && chartResponse.processedData && chartResponse.processedRowCount && chartResponse.originalRowCount && chartResponse.processedRowCount < chartResponse.originalRowCount;

  return (
    <>
      {!originalData ? (
        <div className="flex items-center justify-center h-full min-h-[calc(100vh-8rem)]">
          <Card className="w-full max-w-lg text-center shadow-none border-0 bg-transparent">
              <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Visualize Your Data</CardTitle>
                  <CardDescription>
                  Upload a file to start generating beautiful and insightful charts.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4">
                  <Button asChild>
                      <Link href="/dashboard/upload">Upload File</Link>
                  </Button>
              </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Showing visualizations for {fileName}</p>
            </div>
             <div className="flex flex-wrap gap-2">
                <Button onClick={handleReset} variant="outline">Clear Data</Button>
                <Button asChild>
                    <Link href="/dashboard/upload">Upload New File</Link>
                </Button>
            </div>
          </div>
          
          {slicers.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Filters:</p>
              {slicers.map(slicer => (
                <div key={slicer.name} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{slicer.name.charAt(0).toUpperCase() + slicer.name.slice(1)}:</span>
                  <Select onValueChange={(value) => handleFilterChange(slicer.name, value)} value={filters[slicer.name] || 'all'}>
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue placeholder={`All ${slicer.name}s`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {[...new Set(originalData.data.map(row => row[slicer.name]))].map((option: any) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          {kpiMetrics.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiMetrics.map(metric => <KpiCard key={metric.title} {...metric} />)}
            </div>
          )}
          
          <AIInsights data={filteredData || []} />

          {showOptimizationIndicator && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChartHorizontal className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Data Optimized for Visualization
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Showing {chartResponse.processedRowCount?.toLocaleString()} aggregated data points 
                  from {chartResponse.originalRowCount?.toLocaleString()} total records for cleaner charts.
                </p>
              </div>
            )}

          <ChartGrid 
            data={chartData} 
            suggestions={chartResponse?.suggestions || []}
            isLoading={isLoadingCharts}
          />
        </div>
      )}
    </>
  );
}

    