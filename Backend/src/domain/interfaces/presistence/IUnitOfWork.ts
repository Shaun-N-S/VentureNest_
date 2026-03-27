import { ClientSession } from "mongoose";

export interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getSession(): ClientSession | undefined;
}
