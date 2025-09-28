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
};
