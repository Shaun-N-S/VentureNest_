export interface IBaseRepository<T> {
  save(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
}
