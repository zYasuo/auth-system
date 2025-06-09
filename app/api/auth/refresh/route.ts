// app/api/auth/refresh/route.ts
import { JWTUtils, type CustomJWTPayload } from '@/lib/auth/jwt/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { refreshToken } = await JWTUtils.getTokensFromCookies()
    
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    
    const payload: CustomJWTPayload | null = await JWTUtils.verifyRefreshToken(refreshToken)
    
    if (!payload) {
      await JWTUtils.clearTokenCookies()
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    
    const { accessToken, refreshToken: newRefreshToken } = await JWTUtils.generateTokens({
      userId: payload.userId,
      email: payload.email,
    })
    
    await JWTUtils.setTokenCookies(accessToken, newRefreshToken)
    
    return NextResponse.redirect(new URL('/user', request.url))
  } catch (error) {
    await JWTUtils.clearTokenCookies()
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}