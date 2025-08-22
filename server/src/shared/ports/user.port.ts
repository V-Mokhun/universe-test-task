import { User as DbUser } from "@db";

export type User = Pick<DbUser, "id" | "email">;
