export interface IStorageService {
  upload(file: File, key: string): Promise<string>;
  createSignedUrl(key: string, expiary: number): Promise<string>;
}
