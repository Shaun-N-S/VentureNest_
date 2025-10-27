import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_MAIL: process.env.GOOGLE_MAIL,
  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECERT: process.env.GOOGLE_CLIENT_SECERT || "",
  REFRESH_TOKEN_EXPIRES_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_EXPIRES_TIME: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
};
