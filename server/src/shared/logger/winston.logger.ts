import { createLogger, format, Logger, transports } from "winston";
import { ErrorLogData, ILogger, LogData, LogLevel } from "./logger.interface";

export class WinstonLogger implements ILogger {
  private logger: Logger;
  logLevel: LogLevel;

  constructor(env: string, logLevel: LogLevel = "info") {
    this.logLevel = logLevel;

    const usedTransports = [];

    if (env !== "test") {
      usedTransports.push(
        new transports.Console({
          format: format.combine(format.simple(), format.colorize()),
        })
      );
    }

    this.logger = createLogger({
      level: this.logLevel,
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
      },
      format: format.combine(format.timestamp(), format.json()),
      defaultMeta: {
        timestamp: new Date().toISOString(),
        env,
      },
      transports: usedTransports,
    });
  }

  info(data: LogData): void {
    this.logger.info(data);
  }

  warn(data: ErrorLogData): void {
    this.logger.warn(data);
  }

  error(data: ErrorLogData): void {
    this.logger.error(data);
  }

  debug(data: LogData): void {
    this.logger.debug(data);
  }
}
