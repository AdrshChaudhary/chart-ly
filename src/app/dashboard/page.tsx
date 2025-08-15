
"use client";

import * as React from 'react';
import { FileUploader } from '@/components/file-uploader';
import { ChartGrid } from '@/components/chart-grid';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';

export type ParsedData = {
  data: any[];
  meta: {
    fields: string[];
  };
};

export default function DashboardPage() {
  const [parsedData, setParsedData] = React.useState<ParsedData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');

  const handleDataParsed = (data: ParsedData, file: File) => {
    setParsedData(data);
    setFileName(file.name);
    setError(null);
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {!parsedData ? (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
              Create Charts Instantly
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Upload a CSV, XLSX, or JSON file to get started.
            </p>
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
                <h2 className="text-2xl font-bold text-foreground">Visualizations</h2>
                <p className="text-muted-foreground">Charts generated from {fileName}</p>
              </div>
              <Button onClick={handleReset} variant="outline">Upload Another File</Button>
            </div>
            <ChartGrid data={parsedData.data} />
          </div>
        )}
      </main>
      <footer className="text-center py-4 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Chartly. All rights reserved.</p>
      </footer>
    </div>
  );
}
