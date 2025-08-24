
"use client";

import * as React from 'react';
import { FileUploader } from '@/components/file-uploader';
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
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();


  const handleDataParsed = (data: ParsedData, file: File) => {
    setError(null);
    try {
      const dataToPass = {
          parsedData: data,
          fileName: file.name,
      };
      // Use sessionStorage to avoid long URLs that can be blocked.
      sessionStorage.setItem('chartly-new-upload', JSON.stringify(dataToPass));
      router.push(`/dashboard`);
    } catch (e) {
       const message = "Could not process file. Your browser's session storage might be full or disabled.";
       onError(message);
    }
  };

  const handleParsingError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
        variant: "destructive",
        title: "Parsing Error",
        description: errorMessage,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          Upload Your Data
        </h1>
        <p className="text-muted-foreground">
          Upload a CSV, XLSX, or JSON file. You will be redirected upon successful upload.
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
  );
}
