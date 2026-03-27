import mongoose, { ClientSession } from "mongoose";
import { IUnitOfWork } from "@domain/interfaces/presistence/IUnitOfWork";

export class MongooseUnitOfWork implements IUnitOfWork {
  private _session: ClientSession | undefined;

  async start(): Promise<void> {
    this._session = await mongoose.startSession();
    this._session.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this._session) return;

    await this._session.commitTransaction();
    this._session.endSession();
    this._session = undefined;
  }

  async rollback(): Promise<void> {
    if (!this._session) return;

    await this._session.abortTransaction();
    this._session.endSession();
    this._session = undefined;
  }

  getSession(): ClientSession | undefined {
    return this._session;
  }
}
