import { prisma } from "@/lib/prisma/prisma"
import type { PasswordResetToken } from "@/lib/generated/prisma"

export interface IPasswordResetTokenRepository {
  create(data: {
    token: string
    email: string
    userId: string
    expiresAt: Date
  }): Promise<PasswordResetToken>

  findByToken(token: string): Promise<PasswordResetToken | null>

  markAsUsed(id: string): Promise<PasswordResetToken>

  deleteExpiredTokens(): Promise<void>

  deleteByUserId(userId: string): Promise<void>
}

export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  async create(data: {
    token: string
    email: string
    userId: string
    expiresAt: Date
  }): Promise<PasswordResetToken> {
    return await prisma.passwordResetToken.create({
      data,
    })
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })
  }

  async markAsUsed(id: string): Promise<PasswordResetToken> {
    return await prisma.passwordResetToken.update({
      where: { id },
      data: { used: true },
    })
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { used: true }],
      },
    })
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: { userId },
    })
  }
}
