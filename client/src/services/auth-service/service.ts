import { BaseService } from "../base-service";
import type { IHttpClient } from "../http-client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "./types";

export class AuthService extends BaseService {
  constructor(httpClient?: IHttpClient) {
    super(httpClient);
  }

  async login(
    credentials: LoginCredentials
  ): Promise<{ data?: AuthResponse; error?: string }> {
    const response = await this.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.data) {
      return { data: response.data };
    }

    return { error: response.error || "Login failed" };
  }

  async register(
    credentials: RegisterCredentials
  ): Promise<{ data?: AuthResponse; error?: string }> {
    const response = await this.post<AuthResponse>("/auth/register", {
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
    });

    if (response.data) {
      return { data: response.data };
    }

    return { error: response.error || "Registration failed" };
  }

  async logout(): Promise<void> {
    try {
      await this.post("/auth/logout");
    } catch {
      console.warn("Logout request failed");
    } finally {
      this.httpClient.resetRefreshState();
    }
  }

  async getCurrentUser(): Promise<{ data?: User; error?: string }> {
    const response = await this.get<User>("/auth/me");

    if (response.data) {
      return { data: response.data };
    }

    return { error: response.error || "Failed to get user data" };
  }

  async refreshToken(): Promise<boolean> {
    const response = await this.post<{ user: User }>("/auth/refresh");
    return response.status === 200;
  }
}
