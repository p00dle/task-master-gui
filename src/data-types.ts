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

export interface DataSourceData {
  name: string;
  sourceLastUpdated: Record<string, number | null>;
  sourceLastTouched: Record<string, number | null>;
  targetLastUpdated: Record<string, number | null>;
  targetLastTouched: Record<string, number | null>;
}

export interface TaskData {
  name: string;
  status: string;
  step: string | null;
  lastExecuted: number | null;
  lastError: number | null;
  error: string | null;
}
