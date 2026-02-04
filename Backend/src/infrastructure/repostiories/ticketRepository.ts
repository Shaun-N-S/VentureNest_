import { TicketEntity } from "@domain/entities/Ticket/ticketEntity";
import { ITicketRepository } from "@domain/interfaces/repositories/ITicketRepository";
import { ITicketModel } from "@infrastructure/db/models/ticketModel";
import { TicketDetailedDTO } from "application/dto/ticket/TicketDetailedDTO";
import { TicketMapper } from "application/mappers/ticketMapper";
import mongoose, { Model } from "mongoose";

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

    if (status) query.overallStatus = status;
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

    if (status) query.overallStatus = status;
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

  async findInvestorTicketsDetailed(investorId: string): Promise<TicketDetailedDTO[]> {
    const docs = await this._model
      .find({ investorId })
      .populate("projectId", "startupName coverImageUrl location logoUrl")
      .populate("founderId", "userName profileImg")
      .populate("investorId", "userName profileImg")
      .populate({ path: "sessions", options: { sort: { date: 1 } } })
      .sort({ createdAt: -1 })
      .lean();

    return docs.map((t: any) => ({
      ticketId: t._id.toString(),
      ticketNumber: t.ticketNumber,
      currentStage: t.currentStage,
      overallStatus: t.overallStatus,
      createdAt: t.createdAt,

      project: {
        id: t.projectId._id.toString(),
        startupName: t.projectId.startupName,
        coverImageUrl: t.projectId.coverImageUrl,
        logoUrl: t.projectId.logoUrl,
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
        stage: s.stage,
        decision: s.decision,
        cancelReason: s.cancelReason,
      })),
    }));
  }

  async findFounderTicketsDetailed(founderId: string): Promise<TicketDetailedDTO[]> {
    const founderObjectId = new mongoose.Types.ObjectId(founderId);

    const docs = await this._model.aggregate([
      { $match: { founderId: founderObjectId } },

      // PROJECT
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },

      // INVESTOR
      {
        $lookup: {
          from: "investors",
          localField: "investorId",
          foreignField: "_id",
          as: "investor",
        },
      },
      { $unwind: "$investor" },

      // FOUNDER
      {
        $lookup: {
          from: "users",
          localField: "founderId",
          foreignField: "_id",
          as: "founder",
        },
      },
      { $unwind: "$founder" },

      // SESSIONS
      {
        $lookup: {
          from: "sessions",
          localField: "_id",
          foreignField: "ticketId",
          as: "sessions",
          pipeline: [{ $sort: { date: 1 } }],
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return docs.map((t: any) => ({
      ticketId: t._id.toString(),
      ticketNumber: t.ticketNumber,
      currentStage: t.currentStage,
      overallStatus: t.overallStatus,
      createdAt: t.createdAt,

      project: {
        id: t.project._id.toString(),
        startupName: t.project.startupName,
        coverImageUrl: t.project.coverImageUrl,
        logoUrl: t.project.logoUrl,
        location: t.project.location,
      },

      founder: {
        id: t.founder._id.toString(),
        name: t.founder.userName,
        profileImg: t.founder.profileImg,
      },

      investor: {
        id: t.investor._id.toString(),
        name: t.investor.userName,
        profileImg: t.investor.profileImg,
      },

      sessions: t.sessions.map((s: any) => ({
        id: s._id.toString(),
        sessionName: s.sessionName,
        date: s.date,
        startTime: s.startTime,
        duration: s.duration,
        status: s.status,
        stage: s.stage,
        decision: s.decision,
        cancelReason: s.cancelReason,
      })),
    }));
  }

  async findTicketDetailedById(ticketId: string): Promise<TicketDetailedDTO | null> {
    const _id = new mongoose.Types.ObjectId(ticketId);

    const docs = await this._model.aggregate([
      { $match: { _id } },

      // PROJECT
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },

      // INVESTOR
      {
        $lookup: {
          from: "investors",
          localField: "investorId",
          foreignField: "_id",
          as: "investor",
        },
      },
      { $unwind: "$investor" },

      // FOUNDER
      {
        $lookup: {
          from: "users",
          localField: "founderId",
          foreignField: "_id",
          as: "founder",
        },
      },
      { $unwind: "$founder" },

      // SESSIONS
      {
        $lookup: {
          from: "sessions",
          localField: "_id",
          foreignField: "ticketId",
          as: "sessions",
          pipeline: [{ $sort: { date: 1 } }],
        },
      },
    ]);

    if (!docs.length) return null;

    const t = docs[0];

    return {
      ticketId: t._id.toString(),
      ticketNumber: t.ticketNumber,
      currentStage: t.currentStage,
      overallStatus: t.overallStatus,
      createdAt: t.createdAt,

      project: {
        id: t.project._id.toString(),
        startupName: t.project.startupName,
        logoUrl: t.project.logoUrl,
        coverImageUrl: t.project.coverImageUrl,
        location: t.project.location,
      },

      founder: {
        id: t.founder._id.toString(),
        name: t.founder.userName,
        profileImg: t.founder.profileImg,
      },

      investor: {
        id: t.investor._id.toString(),
        name: t.investor.userName,
        profileImg: t.investor.profileImg,
      },

      sessions: t.sessions.map((s: any) => ({
        id: s._id.toString(),
        sessionName: s.sessionName,
        date: s.date,
        startTime: s.startTime,
        duration: s.duration,
        status: s.status,
        cancelReason: s.cancelReason,
      })),
    };
  }

  async findByInvestorAndProject(
    investorId: string,
    projectId: string
  ): Promise<TicketEntity | null> {
    const doc = await this._model.findOne({ investorId, projectId });
    return doc ? TicketMapper.toEntity(doc) : null;
  }
}
