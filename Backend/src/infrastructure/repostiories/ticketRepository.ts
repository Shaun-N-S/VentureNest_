import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { ticketModel } from "@infrastructure/db/models/ticketModel";
import { TicketMapper } from "application/mappers/ticketMapper";

export class TicketRepository implements ITicketRepository {
  async save(data: TicketEntity): Promise<TicketEntity> {
    const doc = await ticketModel.create(TicketMapper.toMongoose(data));
    return TicketMapper.toEntity(doc);
  }

  async findById(id: string): Promise<TicketEntity | null> {
    const doc = await ticketModel.findById(id);
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

    const docs = await ticketModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return docs.map(TicketMapper.toEntity);
  }

  async findByIds(ids: string[]): Promise<TicketEntity[]> {
    const docs = await ticketModel.find({ _id: { $in: ids } });
    return docs.map(TicketMapper.toEntity);
  }

  async count(status?: string, search?: string, extraQuery: any = {}): Promise<number> {
    const query: any = { ...extraQuery };

    if (status) query.status = status;
    if (search) query.ticketNumber = { $regex: search, $options: "i" };

    return ticketModel.countDocuments(query);
  }

  async update(id: string, data: Partial<TicketEntity>): Promise<TicketEntity | null> {
    const doc = await ticketModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? TicketMapper.toEntity(doc) : null;
  }

  // 🔹 Custom methods

  async findByInvestor(investorId: string): Promise<TicketEntity[]> {
    const docs = await ticketModel.find({ investorId });
    return docs.map(TicketMapper.toEntity);
  }

  async findByFounder(founderId: string): Promise<TicketEntity[]> {
    const docs = await ticketModel.find({ founderId });
    return docs.map(TicketMapper.toEntity);
  }

  async findByProject(projectId: string): Promise<TicketEntity[]> {
    const docs = await ticketModel.find({ projectId });
    return docs.map(TicketMapper.toEntity);
  }
}
