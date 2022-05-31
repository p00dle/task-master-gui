interface HydrationData {
  logs: {
    timestamp: number;
    level: string;
    namespace: string;
    message: string;
    details?: string;
  }[];
  credentials: {
    name: string;
    username: string | null;
    valid: boolean | null;
    hasPassword: boolean;
  }[];
  sessions: {
    name: string;
    status: string;
    uptimeSince: number | null;
    lastError: number | null;
    error: string | null;
    inQueue: number;
    isInitialised: boolean;
  }[];
  tasks: any[];
}

// declare global {
//   const __INITIAL_DATA__: HydrationData;
//   interface Window {
//     __INITIAL_DATA__: InitialData;
//   }
// }

declare const __INITIAL_DATA__: HydrationData;

interface Window {
  __INITIAL_DATA__: InitialData;
}
