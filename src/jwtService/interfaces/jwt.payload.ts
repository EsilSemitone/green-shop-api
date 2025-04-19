import { ROLES } from "contracts";

export interface IJwtPayload {
    userId: number, 
    role: ROLES
}