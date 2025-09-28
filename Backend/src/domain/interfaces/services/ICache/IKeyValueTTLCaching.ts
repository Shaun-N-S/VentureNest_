export interface IKeyValueTTLCaching {
  setData(key: string, time: number, value: string): Promise<void>;
  getData(key: string): Promise<string | null>;
  deleteData(key: string): Promise<void>;
}
