import { ROLES } from "contracts";
import { IJwtPayload } from "./interfaces/jwt.payload";

export interface IJwtService {
    signAccess(userId: string, role: ROLES): Promise<string>
    signRefresh(userId: string, role: ROLES): Promise<string>
    verify(token: string): Promise<IJwtPayload> 
}