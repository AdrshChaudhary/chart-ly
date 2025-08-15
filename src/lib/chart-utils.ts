
export type ColumnType = 'numeric' | 'date' | 'categorical';

export interface ColumnInfo {
  name: string;
  type: ColumnType;
}

const isNumeric = (val: any): boolean => {
  if (typeof val === 'number' && isFinite(val)) return true;
  if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) return true;
  return false;
};

export const isDate = (val: any): boolean => {
  if (val instanceof Date) return true;
  if (typeof val === 'string' || typeof val === 'number') {
    // Check for YYYY-MM-DD or other common date formats, and that it's a valid date
    const date = new Date(val);
    return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(val.toString());
  }
  return false;
};

export function detectColumnTypes(data: any[]): ColumnInfo[] {
  if (!data || data.length === 0) return [];

  const fields = Object.keys(data[0]);
  const sampleSize = Math.min(data.length, 10);
  const samples = data.slice(0, sampleSize);

  return fields.map(field => {
    let isConsistentlyDate = true;
    let isConsistentlyNumeric = true;

    for (const row of samples) {
        const value = row[field];
        if (value === null || value === undefined || value === '') continue;

        if (isConsistentlyDate && !isDate(value)) {
            isConsistentlyDate = false;
        }
        if (isConsistentlyNumeric && !isNumeric(value)) {
            isConsistentlyNumeric = false;
        }
    }

    if (isConsistentlyDate) return { name: field, type: 'date' };
    if (isConsistentlyNumeric) return { name: field, type: 'numeric' };
    return { name: field, type: 'categorical' };
  });
}

export function getChartSuggestions(columns: ColumnInfo[]): ('line' | 'bar' | 'pie' | 'scatter' | 'radar')[] {
  const suggestions = new Set<'line' | 'bar' | 'pie' | 'scatter' | 'radar'>();
  
  const numericCols = columns.filter(c => c.type === 'numeric');
  const dateCols = columns.filter(c => c.type === 'date').length;
  const categoricalCols = columns.filter(c => c.type === 'categorical').length;

  if (numericCols.length >= 1) {
    if (dateCols >= 1 || categoricalCols >=1) {
      suggestions.add('line');
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

export const findKey = (columns: ColumnInfo[], type: ColumnType): string | undefined => {
    const column = columns.find(c => c.type === type);
    return column?.name;
}
