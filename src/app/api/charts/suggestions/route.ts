
import { NextResponse } from 'next/server';

type ColumnType = 'numeric' | 'date' | 'categorical';

interface ColumnInfo {
  name: string;
  type: ColumnType;
}

const isNumeric = (val: any): boolean => {
  if (val === null || val === undefined || val === '') return false;
  if (typeof val === 'number' && isFinite(val)) return true;
  if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) return true;
  return false;
};

const isDate = (val: any): boolean => {
  if (val === null || val === undefined || val === '') return false;
  if (val instanceof Date) return true;
  if (typeof val === 'string' || typeof val === 'number') {
    const date = new Date(val);
    return !isNaN(date.getTime()) && (/\d{4}-\d{2}-\d{2}/.test(val.toString()) || date.toString() !== 'Invalid Date' && val.toString().length > 4);
  }
  return false;
};

function detectColumnTypes(data: any[]): ColumnInfo[] {
  if (!data || data.length === 0) return [];

  const fields = Object.keys(data[0]);
  const sampleSize = Math.min(data.length, 20);
  const samples = data.slice(0, sampleSize);

  return fields.map(field => {
    let numericCount = 0;
    let dateCount = 0;
    let nonNullCount = 0;
    
    for (const row of samples) {
        const value = row[field];
        if (value === null || value === undefined || value === '') continue;
        nonNullCount++;
        if (isNumeric(value)) numericCount++;
        if (isDate(value)) dateCount++;
    }
    
    if (nonNullCount === 0) {
      return { name: field, type: 'categorical' };
    }

    if (dateCount / nonNullCount > 0.8) return { name: field, type: 'date' };
    if (numericCount / nonNullCount > 0.8) return { name: field, type: 'numeric' };

    return { name: field, type: 'categorical' };
  });
}

function getChartSuggestions(columns: ColumnInfo[]): ('line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'area')[] {
  const suggestions = new Set<'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'area'>();
  
  const numericCols = columns.filter(c => c.type === 'numeric');
  const dateCols = columns.filter(c => c.type === 'date').length;
  const categoricalCols = columns.filter(c => c.type === 'categorical').length;

  if (numericCols.length >= 1) {
    if (dateCols >= 1 || categoricalCols >=1) {
      suggestions.add('line');
      suggestions.add('area');
    }
    if (categoricalCols >= 1) {
      suggestions.add('bar');
      suggestions.add('pie');
    }
  }

  if (numericCols.length >= 2) {
      suggestions.add('scatter');
  }

  if (categoricalCols >= 1 && numericCols.length >= 2) {
      suggestions.add('radar');
  }
  
  return Array.from(suggestions);
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body.data;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    // TODO: Here is where you would forward the request to your Python backend.
    // For now, we will use the local utility functions after a short delay.
    
    console.log("Received data for chart suggestions:", data.length, "rows");

    const columnInfo = detectColumnTypes(data);
    const suggestions = getChartSuggestions(columnInfo);

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ suggestions, columnInfo });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process the request', details: error.message }, { status: 500 });
  }
}
