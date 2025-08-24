
export type ColumnType = 'numeric' | 'date' | 'categorical';

export interface ColumnInfo {
  name: string;
  type: ColumnType;
}

export type ChartSuggestion = {
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'area';
  title: string;
  description: string;
  aggregated?: boolean;
  xAxis?: string;
  yAxis?: string[];
  nameKey?: string;
  valueKey?: string;
  categoryKey?: string;
  indexKey?: string;
};

export function isDate(value: any): boolean {
  if (value instanceof Date) return true;
  if (typeof value !== 'string') return false;
  return !isNaN(new Date(value).getTime()) && /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value);
}

    