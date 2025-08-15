
"use client";

import * as React from 'react';
import { ChartGrid } from '@/components/chart-grid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileUp } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export type ParsedData = {
  data: any[];
  meta: {
    fields: string[];
  };
};

const dummyData = {
    data: [
      { month: '2023-01-01', sales: 4000, profit: 2400, expenses: 2200, users: 100, budget: 3000 },
      { month: '2023-02-01', sales: 3000, profit: 1398, expenses: 2000, users: 120, budget: 2500 },
      { month: '2023-03-01', sales: 5000, profit: 9800, expenses: 2500, users: 150, budget: 2800 },
      { month: '2023-04-01', sales: 2780, profit: 3908, expenses: 2100, users: 130, budget: 2600 },
      { month: '2023-05-01', sales: 1890, profit: 4800, expenses: 1500, users: 110, budget: 2000 },
      { month: '2023-06-01', sales: 2390, profit: 3800, expenses: 1800, users: 140, budget: 2200 },
      { month: '2023-07-01', sales: 3490, profit: 4300, expenses: 2300, users: 160, budget: 2400 },
    ],
    meta: {
        fields: ['month', 'sales', 'profit', 'expenses', 'users', 'budget']
    }
}

export default function DashboardPage() {
  const [parsedData, setParsedData] = React.useState<ParsedData | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const { toast } = useToast();

  React.useEffect(() => {
    const storedData = localStorage.getItem('parsedData');
    const storedFileName = localStorage.getItem('fileName');
    if (storedData) {
      setParsedData(JSON.parse(storedData));
      setFileName(storedFileName || '');
    }
  }, []);

  const handleReset = () => {
    setParsedData(null);
    setFileName('');
    localStorage.removeItem('parsedData');
    localStorage.removeItem('fileName');
  };
  
  const handleDummyData = () => {
    setParsedData(dummyData);
    setFileName('dummy-data.json');
    toast({
        title: "Dummy data loaded",
        description: "Showing charts for dummy-data.json"
    })
  }

  return (
    <main className="flex-grow p-4 md:p-8">
    {!parsedData ? (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <FileUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>No Data Uploaded</CardTitle>
                <CardDescription>
                Upload a file to start generating beautiful and insightful charts for your dashboard, or generate some dummy data to get started.
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
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Showing visualizations for {fileName}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline">Clear Data</Button>
            <Button asChild>
              <Link href="/dashboard/upload">Upload New File</Link>
            </Button>
          </div>
        </div>
        <ChartGrid data={parsedData.data} />
      </div>
    )}
  </main>
  );
}
