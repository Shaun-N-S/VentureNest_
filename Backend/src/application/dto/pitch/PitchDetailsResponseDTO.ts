import { PitchStatus } from "@domain/enum/pitchStatus";

export interface PitchDetailsResponseDTO {
  pitchId: string;

  project: {
    id: string;
    name: string;
    logoUrl?: string;
  };

  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };

  investor: {
    id: string;
    companyName: string;
    profileImg?: string;
  };

  subject: string;
  message: string;

  investorReply?: {
    message: string;
    repliedAt: string;
  };

  status: PitchStatus;
  createdAt: string;
}

export interface PitchDetailsPopulated {
  _id: string;
  subject: string;
  message: string;
  status: PitchStatus;
  createdAt: Date;

  investorReply?: {
    message: string;
    repliedAt: Date;
  };

  projectId: {
    _id: string;
    startupName: string;
    logoUrl?: string;
  };

  founderId: {
    _id: string;
    userName: string;
    profileImg?: string;
  };

  investorId: {
    _id: string;
    companyName: string;
    profileImg?: string;
  };
}

export interface InvestorReplyDTO {
  message: string;
  repliedAt: Date;
}
