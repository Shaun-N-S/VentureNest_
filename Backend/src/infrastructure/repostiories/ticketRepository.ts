// infrastructure/repositories/ticketRepository.ts

import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { ITicketModel } from "@infrastructure/db/models/ticketModel";
import { InvestorTicketDetailedDTO } from "application/dto/ticket/InvestorTicketDetailedDTO";
import { TicketMapper } from "application/mappers/ticketMapper";
import { Model } from "mongoose";

export class TicketRepository implements ITicketRepository {
  constructor(private readonly _model: Model<ITicketModel>) {}

  async save(data: TicketEntity): Promise<TicketEntity> {
    const doc = await this._model.create(TicketMapper.toMongoose(data));
    return TicketMapper.toEntity(doc);
  }

  async findById(id: string): Promise<TicketEntity | null> {
    const doc = await this._model.findById(id);
    return doc ? TicketMapper.toEntity(doc) : null;
  }

  async findAll(
    skip = 0,
    limit = 10,
    status?: string,
    search?: string,
    extraQuery: any = {}
  ): Promise<TicketEntity[]> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) query.ticketNumber = { $regex: search, $options: "i" };

    const docs = await this._model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return docs.map(TicketMapper.toEntity);
  }

  async findByIds(ids: string[]): Promise<TicketEntity[]> {
    const docs = await this._model.find({ _id: { $in: ids } });
    return docs.map(TicketMapper.toEntity);
  }

  async count(status?: string, search?: string, extraQuery: any = {}): Promise<number> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) query.ticketNumber = { $regex: search, $options: "i" };

    return this._model.countDocuments(query);
  }

  async update(id: string, data: Partial<TicketEntity>): Promise<TicketEntity | null> {
    const doc = await this._model.findByIdAndUpdate(id, data, { new: true });
    return doc ? TicketMapper.toEntity(doc) : null;
  }

  async findByInvestor(investorId: string): Promise<TicketEntity[]> {
    const docs = await this._model.find({ investorId });
    return docs.map(TicketMapper.toEntity);
  }

  async findByFounder(founderId: string): Promise<TicketEntity[]> {
    const docs = await this._model.find({ founderId });
    return docs.map(TicketMapper.toEntity);
  }

  async findByProject(projectId: string): Promise<TicketEntity[]> {
    const docs = await this._model.find({ projectId });
    return docs.map(TicketMapper.toEntity);
  }

  async findInvestorTicketsDetailed(investorId: string): Promise<InvestorTicketDetailedDTO[]> {
    const docs = await this._model
      .find({ investorId })
      .populate("projectId", "startupName coverImageUrl location")
      .populate("founderId", "userName profileImg")
      .populate("investorId", "userName profileImg")
      .populate({
        path: "sessions",
        options: { sort: { date: 1 } },
      })
      .sort({ createdAt: -1 })
      .lean();

    return docs.map((t: any) => ({
      ticketId: t._id.toString(),
      ticketNumber: t.ticketNumber,
      stage: t.stage,
      status: t.status,
      createdAt: t.createdAt,

      project: {
        id: t.projectId._id.toString(),
        startupName: t.projectId.startupName,
        coverImageUrl: t.projectId.coverImageUrl,
        location: t.projectId.location,
      },

      founder: {
        id: t.founderId._id.toString(),
        name: t.founderId.userName,
        profileImg: t.founderId.profileImg,
      },

      investor: {
        id: t.investorId._id.toString(),
        name: t.investorId.userName,
        profileImg: t.investorId.profileImg,
      },

      sessions: (t.sessions ?? []).map((s: any) => ({
        id: s._id.toString(),
        sessionName: s.sessionName,
        date: s.date,
        startTime: s.startTime,
        duration: s.duration,
        status: s.status,
      })),
    }));
  }
}
