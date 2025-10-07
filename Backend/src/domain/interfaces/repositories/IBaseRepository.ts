export interface IBaseRepository<T> {
  save(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(skip?: number, limit?: number, status?: string, search?: string): Promise<T[]>;
  count(status?: string, search?: string): Promise<number>;
}
