import { ClientSession } from "mongoose";

export interface IBaseRepository<T> {
  save(data: T, session?: ClientSession): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(
    skip?: number,
    limit?: number,
    status?: string,
    search?: string,
    extraQuery?: any
  ): Promise<T[]>;
  findByIds(ids: string[]): Promise<T[]>;
  count(status?: string, search?: string, extraQuery?: any): Promise<number>;
  update(id: string, data: Partial<T>, session?: ClientSession): Promise<T | null>;
}
