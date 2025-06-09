import { prisma } from "@/lib/prisma/prisma";

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  create(data: { name: string; email: string; password: string }): Promise<any>;
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
