import { IJwtPayload } from '../core/jwtService/interfaces/jwt.payload';

declare module 'express' {
    export interface Request {
        user?: IJwtPayload;
        cartId?: string;
    }
}
