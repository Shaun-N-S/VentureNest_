import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CONFIG } from "@config/config";
import { IStorageService } from "@domain/interfaces/services/IStorage/IStorageService";
import { Errors } from "@shared/constants/error";
import { fileToBuffer } from "@shared/utils/fileConverter";

export class StorageService implements IStorageService {
  private _client: S3Client;
  constructor() {
    this._client = new S3Client({
      region: CONFIG.S3_REGION as string,
      credentials: {
        accessKeyId: CONFIG.S3_ACCESS_KEY as string,
        secretAccessKey: CONFIG.S3_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async upload(file: File | Buffer, key: string): Promise<string> {
    const data =
      file instanceof Buffer ? file : file instanceof File ? await fileToBuffer(file) : file;
    try {
      const command = new PutObjectCommand({
        Bucket: CONFIG.S3_BUCKET_NAME,
        Key: key,
        Body: data,
      });

      await this._client.send(command);
      return key;
    } catch (error) {
      console.log(error);
      throw new Error(Errors.UPLOAD_ERROR);
    }
  }

  async createSignedUrl(key: string, expiary: number): Promise<string> {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: CONFIG.S3_BUCKET_NAME,
    });

    const signedUrl = await getSignedUrl(this._client, command, {
      expiresIn: expiary,
    });

    return signedUrl;
  }
}
