
"use client";

import * as React from 'react';
import { FileUploader } from '@/components/file-uploader';
import { ChartGrid } from '@/components/chart-grid';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export type ParsedData = {
  data: any[];
  meta: {
    fields: string[];
  };
};

export default function UploadPage() {
  const [parsedData, setParsedData] = React.useState<ParsedData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const router = useRouter();
  const { toast } = useToast();


  const handleDataParsed = (data: ParsedData, file: File) => {
    // In a real app, you'd likely pass this data to the main dashboard page
    // For now, we can just show the chart grid here as a preview
    localStorage.setItem('parsedData', JSON.stringify(data));
    localStorage.setItem('fileName', file.name);
    setParsedData(data);
    setFileName(file.name);
    setError(null);
    toast({
        title: "File uploaded successfully!",
        description: `Showing charts for ${file.name}`
    })
    
    // For demonstration, let's redirect to the dashboard after a "successful" upload
    // You would typically handle state differently (e.g. global state, query params)
    // We will just show the charts on this page for now.
  };

  const handleParsingError = (errorMessage: string) => {
    setError(errorMessage);
    setParsedData(null);
    setFileName('');
  };

  const handleReset = () => {
    setParsedData(null);
    setFileName('');
    setError(null);
    localStorage.removeItem('parsedData');
    localStorage.removeItem('fileName');
  };
  
  const handleGoToDashboard = () => {
    if (parsedData) {
        router.push('/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: "No data uploaded",
            description: "Please upload a file first."
        })
    }
  }

  return (
    <main className="flex-grow p-4 md:p-8">
        {!parsedData ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Upload Your Data
              </h1>
              <p className="text-muted-foreground">
                Upload a CSV, XLSX, or JSON file to get started.
              </p>
            </div>
            <FileUploader
              onDataParsed={handleDataParsed}
              onError={handleParsingError}
            />
            {error && <p className="text-destructive text-center mt-4">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Data Preview</h2>
                <p className="text-muted-foreground">Charts generated from {fileName}</p>
              </div>
              <div className="flex gap-2">
                 <Button onClick={handleReset} variant="outline">Upload Another File</Button>
                 <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
              </div>
            </div>
            <ChartGrid data={parsedData.data} />
          </div>
        )}
      </main>
  );
}
