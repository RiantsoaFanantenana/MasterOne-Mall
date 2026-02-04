
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface MetricData {
  name: string;
  value: number;
  trend: number;
}

export enum AnalysisType {
  STRATEGY = 'Strategy',
  CREATIVE = 'Creative',
  TECHNICAL = 'Technical',
  DATA = 'Data'
}
