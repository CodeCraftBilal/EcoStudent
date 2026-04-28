import { ROLE } from "generated/prisma";

export interface UserSession {
  userId: string;
  userName: string;
  email: string;
  role: ROLE | null;
  profile: string | null;
}