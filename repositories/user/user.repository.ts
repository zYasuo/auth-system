import { prisma } from "@/lib/prisma/prisma";
import { User } from "@/lib/generated/prisma";

export interface IUserRepository {
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<User>;
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

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password },
    });
  }
}
