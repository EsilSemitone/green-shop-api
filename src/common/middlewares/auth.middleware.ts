import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface';
import { IJwtService } from '../../core/jwtService/jwt.service.interface';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types';

@injectable()
export class AuthMiddleware implements IMiddleware {
    constructor(@inject(APP_TYPES.JWT_SERVICE) private jwtService: IJwtService) {}

    async execute(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next();
        }

        try {
            const payload = await this.jwtService.verify(token);
            req.user = payload;
            return next();
        } catch {
            return next();
        }
    }
}
