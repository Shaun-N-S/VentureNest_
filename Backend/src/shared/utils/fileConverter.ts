import { Errors } from "@shared/constants/error";

export function multerFileToFileConverter(multerFile: Express.Multer.File): File {
  const file = new File([new Uint8Array(multerFile.buffer)], multerFile.originalname, {
    type: multerFile.mimetype,
  });
  return file;
}

export async function fileToBuffer(file: File): Promise<Buffer> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error) {
    console.log("", error);
    throw new Error(Errors.CONVERSTION_ERROR);
  }
}
