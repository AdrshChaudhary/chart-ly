
"use client";

import * as React from 'react';
import { FileUploader } from '@/components/file-uploader';
import { ChartGrid } from '@/components/chart-grid';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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
    localStorage.setItem('parsedData', JSON.stringify(data));
    localStorage.setItem('fileName', file.name);
    setParsedData(data);
    setFileName(file.name);
    setError(null);
    toast({
        title: "File uploaded successfully!",
        description: `Showing charts for ${file.name}`
    });
    router.push('/dashboard');
  };

  const handleParsingError = (errorMessage: string) => {
    setError(errorMessage);
    setParsedData(null);
    setFileName('');
    localStorage.removeItem('parsedData');
    localStorage.removeItem('fileName');
  };

  return (
    <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Upload Your Data
            </h1>
            <p className="text-muted-foreground">
              Upload a CSV, XLSX, or JSON file to get started. You will be redirected to the dashboard upon successful upload.
            </p>
          </div>
          <FileUploader
            onDataParsed={handleDataParsed}
            onError={handleParsingError}
          />
          {error && <p className="text-destructive text-center mt-4">{error}</p>}
           <div className="text-center mt-8">
                <Button variant="link" asChild>
                    <Link href="/dashboard">
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
      </main>
  );
}
