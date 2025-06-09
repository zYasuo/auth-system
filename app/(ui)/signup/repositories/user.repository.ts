import { prisma } from "@/lib/prisma/prisma";
import { User } from "@/lib/generated/prisma";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    return await prisma.user.create({
      data,
    });
  }
}
