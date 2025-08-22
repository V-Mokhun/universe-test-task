import { User } from "./user.port";

export interface IAuthRepository {
  register(email: string, hashedPassword: string): Promise<User>;
  findByEmail(
    email: string
  ): Promise<(User & { hashedPassword: string }) | null>;
  findById(id: string): Promise<User | null>;
}
