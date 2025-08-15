"use client";

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileJson, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { ParsedData } from '@/app/page';

interface FileUploaderProps {
  onDataParsed: (data: ParsedData, file: File) => void;
  onError: (error: string) => void;
}

export function FileUploader({ onDataParsed, onError }: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file) return;
    setIsLoading(true);
    
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content as string);
          if (!Array.isArray(jsonData)) throw new Error("JSON must be an array of objects.");
          onDataParsed({ data: jsonData, meta: { fields: Object.keys(jsonData[0] || {}) } }, file);
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          Papa.parse(content as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              onDataParsed({ data: results.data, meta: { fields: results.meta.fields || [] } }, file);
            },
            error: (err) => { throw err; }
          });
        } else if (file.type.includes('spreadsheetml') || file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          onDataParsed({ data: jsonData, meta: { fields: Object.keys(jsonData[0] || {}) } }, file);
        } else {
          throw new Error('Unsupported file type. Please upload a CSV, XLSX, or JSON file.');
        }
      } catch (error: any) {
        const message = error.message || 'Failed to parse file.';
        onError(message);
        toast({ variant: 'destructive', title: 'Parsing Error', description: message });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
        const message = 'Failed to read file.';
        onError(message);
        toast({ variant: 'destructive', title: 'File Read Error', description: message });
        setIsLoading(false);
    };

    if (file.type.includes('spreadsheetml') || file.name.endsWith('.xlsx')) {
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors duration-200 ${isDragging ? 'border-primary bg-accent/50' : 'border-border hover:border-primary/80'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="p-6 text-center">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Parsing your data...</p>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-48">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-semibold mb-2 text-foreground">Drag & drop your file here</p>
              <p className="text-muted-foreground mb-4">or</p>
              <Button onClick={handleClick} type="button">
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv, .xlsx, .json"
                onChange={handleFileChange}
              />
               <div className="flex gap-4 mt-6 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs">
                      <FileText size={16} /> CSV
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                      <FileSpreadsheet size={16} /> XLSX
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                      <FileJson size={16} /> JSON
                  </div>
              </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
