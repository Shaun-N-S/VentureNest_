import multer, { memoryStorage } from "multer";

const PDF_FIELD_NAME = "pitchDeckUrl";
const PDF_MIME_TYPE = "application/pdf";

export const uploadMulter = multer({
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, //10mb limit
  fileFilter: (_req, file, callback) => {
    if (file.fieldname === PDF_FIELD_NAME && file.mimetype !== PDF_MIME_TYPE) {
      callback(new Error("Only PDF files are allowed for the pitch deck"));
      return;
    }

    callback(null, true);
  },
});
