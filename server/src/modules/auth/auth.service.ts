import { IAuthRepository, User } from "@/shared/ports";
import { IAuthService } from "./auth.controller";
import { AuthResponse } from "./auth.types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "@/shared/lib";
import { hashPassword, comparePassword } from "@/shared/lib";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@/shared/exceptions";

export class AuthService implements IAuthService {
  constructor(private readonly repo: IAuthRepository) {}

  async register(email: string, password: string): Promise<AuthResponse> {
    const existingUser = await this.repo.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.repo.register(email, hashedPassword);

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(
      password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = verifyToken(refreshToken);

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Invalid token type");
      }

      const user = await this.repo.findById(payload.userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const newAccessToken = generateAccessToken(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      };
    } catch (_error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async me(userId: string): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async logout(_userId: string): Promise<void> {
    // For now, we'll just return successfully
    // In a more advanced implementation, you could:
    // 1. Add the refresh token to a blacklist
    // 2. Track active sessions
    // 3. Invalidate all user sessions
    return Promise.resolve();
  }
}
