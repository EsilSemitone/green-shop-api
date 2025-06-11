import { ROLES } from "contracts-green-shop";
import { IJwtPayload } from "./interfaces/jwt.payload.ts";

export interface IJwtService {
    signAccess(userId: string, role: ROLES): Promise<string>
    signRefresh(userId: string, role: ROLES): Promise<string>
    verify(token: string): Promise<IJwtPayload> 
}