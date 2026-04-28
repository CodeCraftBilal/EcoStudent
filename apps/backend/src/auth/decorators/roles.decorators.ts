import { SetMetadata } from "@nestjs/common";
import { ROLE } from "generated/prisma";

export const ROLES_KEY = 'roles'
export const Roles = (...roles: [ROLE,...ROLE[]]) => SetMetadata(ROLES_KEY, roles)