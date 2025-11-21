export interface IStorageService {
  upload(file: File | Buffer, key: string): Promise<string>;
  createSignedUrl(key: string, expiary: number): Promise<string>;
  delete(key: string): Promise<void>;
}
