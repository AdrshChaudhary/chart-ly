
"use client";

import * as React from 'react';
import { ChartGrid } from '@/components/chart-grid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Upload, BarChart, TrendingUp, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { detectColumnTypes, ColumnInfo } from '@/lib/chart-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIInsights } from '@/components/ai-insights';

export type ParsedData = {
  data: any[];
  meta: {
    fields: string[];
  };
};

const dummyData = {
    data: [
      { month: 'Jan 2023', sales: 4000, profit: 2400, expenses: 2200, users: 100, region: 'North' },
      { month: 'Feb 2023', sales: 3000, profit: 1398, expenses: 2000, users: 120, region: 'North' },
      { month: 'Mar 2023', sales: 5000, profit: 9800, expenses: 2500, users: 150, region: 'South' },
      { month: 'Apr 2023', sales: 2780, profit: 3908, expenses: 2100, users: 130, region: 'South' },
      { month: 'May 2023', sales: 1890, profit: 4800, expenses: 1500, users: 110, region: 'East' },
      { month: 'Jun 2023', sales: 2390, profit: 3800, expenses: 1800, users: 140, region: 'East' },
      { month: 'Jul 2023', sales: 3490, profit: 4300, expenses: 2300, users: 160, region: 'West' },
      { month: 'Aug 2023', sales: 4200, profit: 5100, expenses: 2400, users: 180, region: 'West' },
      { month: 'Sep 2023', sales: 3800, profit: 4500, expenses: 2000, users: 170, region: 'North' },
      { month: 'Oct 2023', sales: 4500, profit: 6200, expenses: 2800, users: 190, region: 'South' },
      { month: 'Nov 2023', sales: 5100, profit: 7100, expenses: 3000, users: 210, region: 'East' },
      { month: 'Dec 2023', sales: 5800, profit: 8200, expenses: 3200, users: 230, region: 'West' },
    ],
    meta: {
        fields: ['month', 'sales', 'profit', 'expenses', 'users', 'region']
    }
}

type KpiCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
    description?: string;
}

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
  const [parsedData, setParsedData] = React.useState<ParsedData | null>(null);
  const [filteredData, setFilteredData] = React.useState<any[] | null>(null);
  const [columnInfo, setColumnInfo] = React.useState<ColumnInfo[]>([]);
  const [fileName, setFileName] = React.useState<string>('');
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
        try {
            const decodedData = JSON.parse(decodeURIComponent(data));
            const detectedColumns = detectColumnTypes(decodedData.parsedData.data);
            setParsedData(decodedData.parsedData);
            setFilteredData(decodedData.parsedData.data);
            setColumnInfo(detectedColumns);
            setFileName(decodedData.fileName);
            toast({
                title: "File processed successfully!",
                description: `Showing dashboard for ${decodedData.fileName}`
            });
            router.replace('/dashboard', { scroll: false });
        } catch (e) {
            console.error('Failed to parse data from URL', e);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not load data from the previous page.'
            });
        }
    }
  }, [searchParams, router, toast]);

  const handleDummyData = () => {
    const detectedColumns = detectColumnTypes(dummyData.data);
    setParsedData(dummyData);
    setFilteredData(dummyData.data);
    setColumnInfo(detectedColumns);
    setFileName('dummy-data.json');
    toast({
        title: "Dummy data loaded",
        description: "Showing charts for dummy-data.json"
    });
  };

  const handleFilterChange = (columnName: string, value: string) => {
    const newFilters = { ...filters, [columnName]: value };
    if (value === 'all') {
      delete newFilters[columnName];
    }
    setFilters(newFilters);

    let dataToFilter = parsedData?.data || [];
    Object.entries(newFilters).forEach(([key, val]) => {
      dataToFilter = dataToFilter.filter(row => row[key]?.toString() === val);
    });

    setFilteredData(dataToFilter);
  };
  
  const handleReset = () => {
    setParsedData(null);
    setFilteredData(null);
    setFileName('');
    setFilters({});
  };

  const kpiMetrics = React.useMemo(() => {
    if (!filteredData) return [];
    const numericColumns = columnInfo.filter(c => c.type === 'numeric');
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
  }, [filteredData, columnInfo]);
  
  const slicers = React.useMemo(() => {
    return columnInfo.filter(c => c.type === 'categorical' && (parsedData?.data || []).map(row => row[c.name]).filter((v, i, a) => a.indexOf(v) === i).length < 10);
  }, [columnInfo, parsedData]);

  return (
    <>
      {!parsedData ? (
        <div className="flex items-center justify-center h-full min-h-[calc(100vh-8rem)]">
          <Card className="w-full max-w-lg text-center shadow-none border-0 bg-transparent">
              <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Visualize Your Data</CardTitle>
                  <CardDescription>
                  Upload a file to start generating beautiful and insightful charts, or use dummy data to explore the possibilities.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4">
                  <Button asChild>
                      <Link href="/dashboard/upload">Upload File</Link>
                  </Button>
                  <Button variant="secondary" onClick={handleDummyData}>
                      Use Dummy Data
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
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline">Clear Data</Button>
              <Button asChild>
                <Link href="/dashboard/upload">Upload New File</Link>
              </Button>
            </div>
          </div>
          
          {slicers.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Filters:</p>
              {slicers.map(slicer => (
                <div key={slicer.name} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{slicer.name.charAt(0).toUpperCase() + slicer.name.slice(1)}:</span>
                  <Select onValueChange={(value) => handleFilterChange(slicer.name, value)} defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={`All ${slicer.name}s`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {[...new Set(parsedData.data.map(row => row[slicer.name]))].map((option: any) => (
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

          <ChartGrid data={filteredData || []} />
        </div>
      )}
    </>
  );
}
