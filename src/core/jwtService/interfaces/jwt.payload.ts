import { ROLES } from 'contracts';

export interface IJwtPayload {
    userId: string;
    role: ROLES;
}
