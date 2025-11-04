import multer, { memoryStorage } from "multer";

export const uploadMulter = multer({
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, //10mb limit
});
