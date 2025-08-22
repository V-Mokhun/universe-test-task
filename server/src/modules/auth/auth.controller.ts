import { NextFunction, Request, Response } from "express";
import { AuthResponse, LoginRequest, RegisterRequest } from "./auth.types";
import { AuthenticatedRequest } from "@/middleware/auth";
import { User } from "@/shared/ports";
import { env } from "@/config/env";

export interface IAuthService {
  register(email: string, password: string): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  refresh(refreshToken: string): Promise<AuthResponse>;
  me(userId: string): Promise<User>;
  logout(userId: string): Promise<void>;
}

export class AuthController {
  constructor(private readonly service: IAuthService) {}

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ) {
    const isProduction = env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: env.JWT_ACCESS_EXPIRES_IN * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: env.JWT_REFRESH_EXPIRES_IN * 1000,
      path: "/",
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
  }

  async register(req: RegisterRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await this.service.register(email, password);

      this.setAuthCookies(res, data.accessToken, data.refreshToken);

      res.status(201).json({ user: data.user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: LoginRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await this.service.login(email, password);

      this.setAuthCookies(res, data.accessToken, data.refreshToken);

      res.status(200).json({ user: data.user });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
      }

      const data = await this.service.refresh(refreshToken);

      this.setAuthCookies(res, data.accessToken, data.refreshToken);

      res.status(200).json({ user: data.user });
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.service.me(req.user.id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.service.logout(req.user.id);

      this.clearAuthCookies(res);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}
