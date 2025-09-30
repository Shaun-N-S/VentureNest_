import { CONFIG } from "@config/config";
import { Response } from "express";

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true,
    secure: CONFIG.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
}
