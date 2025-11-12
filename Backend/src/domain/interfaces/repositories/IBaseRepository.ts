export interface IBaseRepository<T> {
  save(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(
    skip?: number,
    limit?: number,
    status?: string,
    search?: string,
    extraQuery?: any
  ): Promise<T[]>;
  count(status?: string, search?: string, extraQuery?: any): Promise<number>;
  update(id: string, data: Partial<T>): Promise<T | null>;
}
