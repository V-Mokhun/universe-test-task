import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path, { join } from "path";
import { z } from "zod";

const envPath = path.resolve(join(__dirname, "../..", ".env"));
expand(config({ path: envPath }));

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]),
    API_PORT: z.coerce.number().int().nonnegative(),
    API_URL: z.url(),
    CLIENT_URL: z.url().default("http://localhost:5173"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    JWT_SECRET: z
      .string()
      .min(32, "JWT_SECRET must be at least 32 characters long"),
    JWT_ACCESS_EXPIRES_IN: z.coerce.number().default(15 * 60), // 15 minutes in seconds
    JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(7 * 24 * 60 * 60), // 7 days in seconds
    GITHUB_ACCESS_TOKEN: z.string().min(1, "GITHUB_ACCESS_TOKEN is required"),
  })
  .loose();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment configuration:\n",
    z.treeifyError(parsed.error)
  );
  throw new Error(
    `Environment configuration validation failed: ${parsed.error.message}`
  );
}

export const env = Object.freeze(parsed.data) as Readonly<
  z.infer<typeof envSchema>
>;
