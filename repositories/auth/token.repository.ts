import { Token } from "@/lib/generated/prisma"
import { prisma } from "@/lib/prisma/prisma"

export interface ITokenRepository {
  create(data: {
    token: string
    refreshToken: string
    userId: string
    expiresAt: Date
  }): Promise<Token>
  
  findByToken(token: string): Promise<Token | null>
  findByRefreshToken(refreshToken: string): Promise<Token | null>
  deleteByUserId(userId: string): Promise<void>
  deleteExpiredTokens(): Promise<void>
}

export class TokenRepository implements ITokenRepository {
  async create(data: {
    token: string
    refreshToken: string
    userId: string
    expiresAt: Date
  }): Promise<Token> {
    return await prisma.token.create({ data })
  }

  async findByToken(token: string): Promise<Token | null> {
    return await prisma.token.findUnique({
      where: { token },
      include: { user: true }
    })
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return await prisma.token.findUnique({
      where: { refreshToken },
      include: { user: true }
    })
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.token.deleteMany({
      where: { userId }
    })
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }
}