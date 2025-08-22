import { Router } from "express";
import { AuthController } from "./auth.controller";
import { LoginRequest, RegisterRequest } from "./auth.types";
import {
  AuthenticatedRequest,
  authMiddleware,
  bodyValidator,
} from "@/middleware";
import { LoginSchema, RegisterSchema } from "./auth.schema";

export const createAuthRouter = (controller: AuthController) => {
  const router = Router();

  router.post("/register", bodyValidator(RegisterSchema), (req, res, next) =>
    controller.register(req as RegisterRequest, res, next)
  );

  router.post("/login", bodyValidator(LoginSchema), (req, res, next) =>
    controller.login(req as LoginRequest, res, next)
  );

  router.post("/refresh", (req, res, next) =>
    controller.refresh(req, res, next)
  );

  router.get("/me", authMiddleware, (req, res, next) =>
    controller.me(req as AuthenticatedRequest, res, next)
  );

  router.post("/logout", authMiddleware, (req, res, next) =>
    controller.logout(req as AuthenticatedRequest, res, next)
  );

  return router;
};
