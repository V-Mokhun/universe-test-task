export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogData {
  message: string;
  meta?: Record<string, any>;
}

export interface ErrorLogData extends LogData {
  error?: {
    message: string;
    stack?: string;
    name?: string;
    code?: string;
  };
}

export interface ILogger {
  logLevel: LogLevel;
  info(data: LogData): void;
  warn(data: ErrorLogData): void;
  error(data: ErrorLogData): void;
  debug(data: LogData): void;
}
