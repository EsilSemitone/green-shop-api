import { ROLES } from 'contracts-green-shop';

export interface IJwtPayload {
    userId: string;
    role: ROLES;
}
