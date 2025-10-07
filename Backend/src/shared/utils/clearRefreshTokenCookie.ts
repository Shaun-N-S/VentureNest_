import { CONFIG } from "@config/config";
import { Response } from "express";

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie("RefreshToken", {
    httpOnly: true,
    secure: CONFIG.NODE_ENV === "production",
    sameSite: "strict",
  });
}
