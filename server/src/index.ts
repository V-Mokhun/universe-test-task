import { app } from "./app";
import { env } from "@/config/env";
import { connectDb } from "@/db";
import { logger } from "./shared/logger/logger.factory";

async function startServer() {
  try {
    await connectDb();
    const server = app.listen(env.API_PORT, () => {
      logger.info({
        message: `Server is running on port ${env.API_PORT}`,
      });
    });

    const shutdown = async () => {
      server.close(() => {
        logger.info({
          message: "Server shutdown",
        });
      });

      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error({
      message: "Failed to start server",
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      },
    });
    process.exit(1);
  }
}

startServer();
