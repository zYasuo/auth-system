import { NextResponse } from "next/server"
import { JWTUtils } from "@/lib/auth/jwt/utils"
import { AuthController } from "@/controller/auth/auth.controller"

export async function GET() {
  try {
    const { accessToken } = await JWTUtils.getTokensFromCookies()
    const controller = new AuthController()
    const result = await controller.getCurrentUser(accessToken)

    return NextResponse.json(
      result.success ? { user: result.data, isAuthenticated: true } : { error: result.error, isAuthenticated: false },
      { status: result.status },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error", isAuthenticated: false }, { status: 500 })
  }
}