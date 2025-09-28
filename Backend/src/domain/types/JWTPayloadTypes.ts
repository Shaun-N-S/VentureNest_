import { UserRole } from "domain/enum/userRole";

export type JWTPayloadType = {
  userId: string;
  role: UserRole;
};
