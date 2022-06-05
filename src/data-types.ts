export interface LogData {
  timestamp: number;
  logLevel: string;
  namespace: string;
  message: string;
  details?: string;
}

export interface CredentialsData {
  name: string;
  username: string | null;
  valid: boolean | null;
  hasPassword: boolean;
}

export interface SessionData {
  name: string;
  status: string;
  uptimeSince: number | null;
  lastError: number | null;
  error: string | null;
  inQueue: number;
}

export interface ApiData {
  name: string;
  status: 'In Use' | 'Ready';
  inQueue: number;
  sourcesLastUpdated: Record<string, number | null>;
  sourcesLastTouched: Record<string, number | null>;
  targetsLastUpdated: Record<string, number | null>;
  targetsLastTouched: Record<string, number | null>;
}

export interface TaskData {
  name: string;
  status: string;
  step: string | null;
  lastExecuted: number | null;
  lastError: number | null;
  error: string | null;
}
