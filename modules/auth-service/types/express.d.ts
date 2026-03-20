import { UserRole } from "../../../generated/prisma/enums";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: UserRole;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}