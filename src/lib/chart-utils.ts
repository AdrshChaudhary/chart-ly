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

const isDate = (val: any): boolean => {
  if (val instanceof Date) return true;
  if (typeof val === 'string' || typeof val === 'number') {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }
  return false;
};

export function detectColumnTypes(data: any[]): ColumnInfo[] {
  if (!data || data.length === 0) return [];

  const fields = Object.keys(data[0]);
  const sampleSize = Math.min(data.length, 10);
  const samples = data.slice(0, sampleSize);

  return fields.map(field => {
    let isAlwaysNumeric = true;
    let isAlwaysDate = true;

    for (const row of samples) {
        const value = row[field];
        if (value === null || value === undefined || value === '') continue;

        if (isAlwaysNumeric && !isNumeric(value)) {
            isAlwaysNumeric = false;
        }
        if (isAlwaysDate && !isDate(value)) {
            isAlwaysDate = false;
        }
    }

    if (isAlwaysNumeric) return { name: field, type: 'numeric' };
    if (isAlwaysDate) return { name: field, type: 'date' };
    return { name: field, type: 'categorical' };
  });
}

export function getChartSuggestions(columns: ColumnInfo[]): ('line' | 'bar' | 'pie')[] {
  const suggestions = new Set<'line' | 'bar' | 'pie'>();
  
  const numericCols = columns.filter(c => c.type === 'numeric').length;
  const dateCols = columns.filter(c => c.type === 'date').length;
  const categoricalCols = columns.filter(c => c.type === 'categorical').length;

  if (numericCols >= 1) {
    if (dateCols >= 1) {
      suggestions.add('line');
    }
    if (categoricalCols >= 1) {
      suggestions.add('bar');
      suggestions.add('pie');
    }
  }
  
  return Array.from(suggestions);
}

export const findKey = (columns: ColumnInfo[], type: ColumnType): string | undefined => {
    const column = columns.find(c => c.type === type);
    return column?.name;
}
