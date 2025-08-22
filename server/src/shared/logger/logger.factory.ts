import { env } from "@/config";
import { ILogger, LogLevel } from "./logger.interface";
import { WinstonLogger } from "./winston.logger";

export function createLogger({
  env,
  logLevel = "info",
}: {
  env: string;
  logLevel?: LogLevel;
}): ILogger {
  return new WinstonLogger(env, logLevel);
}

export const logger = createLogger({
  env: env.NODE_ENV,
  logLevel: env.LOG_LEVEL,
});
