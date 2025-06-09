import { NextResponse } from "next/server";
import { JWTUtils } from "@/lib/auth/jwt/utils";
import { TokenRepository } from "@/repositories/token/token.repository";

export async function POST() {
  try {
    const { refreshToken } = await JWTUtils.getTokensFromCookies();

    if (refreshToken) {
      const tokenRepository = new TokenRepository();
      const tokenRecord =
        await tokenRepository.findByRefreshToken(refreshToken);

      if (tokenRecord) {
        await tokenRepository.deleteByUserId(tokenRecord.userId);
      }
    }

    await JWTUtils.clearTokenCookies();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
