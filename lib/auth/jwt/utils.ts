// lib/auth/jwt/utils.ts
import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
)
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret"
)

export interface CustomJWTPayload extends JoseJWTPayload {
  userId: string
  email: string
}

export class JWTUtils {
  static async generateTokens(payload: { userId: string; email: string }) {
    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(JWT_SECRET)

    const refreshToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_REFRESH_SECRET)

    return { accessToken, refreshToken }
  }

  static async verifyAccessToken(token: string): Promise<CustomJWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      if (!payload.userId || !payload.email) {
        return null
      }
      
      return payload as CustomJWTPayload
    } catch (error) {
      return null
    }
  }

  static async verifyRefreshToken(token: string): Promise<CustomJWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
      
      if (!payload.userId || !payload.email) {
        return null
      }
      
      return payload as CustomJWTPayload
    } catch (error) {
      return null
    }
  }

  static async setTokenCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies()

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    })

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })
  }

  static async clearTokenCookies() {
    const cookieStore = await cookies()
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")
  }

  static async getTokensFromCookies() {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value
    const refreshToken = cookieStore.get("refresh_token")?.value
    
    return { accessToken, refreshToken }
  }
}