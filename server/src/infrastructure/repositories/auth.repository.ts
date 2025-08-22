import { IDatabase, User } from "@/shared/ports";
import { IAuthRepository } from "@/shared/ports";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly db: IDatabase) {}

  async register(email: string, hashedPassword: string): Promise<User> {
    const user = await this.db.user.create({
      data: {
        email,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }

  async findByEmail(
    email: string
  ): Promise<(User & { hashedPassword: string }) | null> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        hashedPassword: true,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }
}
