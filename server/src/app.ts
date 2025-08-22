import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "@/config/env";
import { getDb } from "@/db";
import { errorMiddleware } from "./middleware";
import { createAuthController, createAuthRouter } from "./modules";
import { createProjectsController, createProjectsRouter } from "./modules";
import { logger } from "./shared/logger/logger.factory";

export const app = express();

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}

app.use(helmet());
app.use(
  cors({
    origin: env.NODE_ENV === "production" ? env.CLIENT_URL : true,
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (_req, res) => {
  const db = getDb();

  const dbStatus = await db
    .$queryRawUnsafe("SELECT 1")
    .then(() => ({ status: "ok" }))
    .catch((e: Error) => ({ status: "error", message: e.message }));

  const isHealthy = dbStatus.status === "ok";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "error",
    uptime: process.uptime(),
    timestamp: Date.now(),
    checks: [{ name: "database", ...dbStatus }],
  });
});

const authController = createAuthController({
  db: getDb(),
});
const authRouter = createAuthRouter(authController);
app.use("/api/auth", authRouter);

const projectsController = createProjectsController({
  db: getDb(),
  logger: logger,
  accessToken: env.GITHUB_ACCESS_TOKEN,
});
const projectsRouter = createProjectsRouter(projectsController);
app.use("/api/projects", projectsRouter);

app.use(errorMiddleware);
