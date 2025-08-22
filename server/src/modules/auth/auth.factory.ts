import { IDatabase } from "@/shared/ports";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "@/infrastructure/repositories/auth.repository";

export function createAuthController({
  db,
}: {
  db: IDatabase;
}): AuthController {
  const repo = new AuthRepository(db);
  const service = new AuthService(repo);
  return new AuthController(service);
}
