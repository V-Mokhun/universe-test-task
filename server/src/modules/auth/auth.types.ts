import { ParsedRequest } from "@/types/global";
import { LoginBody, RegisterBody } from "./auth.schema";
import { User } from "@/shared/ports";

export type RegisterRequest = ParsedRequest<{}, {}, RegisterBody, {}>;

export type LoginRequest = ParsedRequest<{}, {}, LoginBody, {}>;

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
