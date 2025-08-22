import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/shared/lib";
import { User } from "@/shared/ports";
import { ParsedRequest } from "@/types/global";
import * as core from "express-serve-static-core";

export type AuthenticatedRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> = ParsedRequest<P, ResBody, ReqBody, ReqQuery, Locals> & {
  user: User;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: "No access token provided" });
      return;
    }

    const payload = verifyToken(accessToken);

    if (payload.type !== "access") {
      res.status(401).json({ message: "Invalid token type" });
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (_error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
