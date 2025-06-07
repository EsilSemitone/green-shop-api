import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface.ts';
import { HttpException } from '../exceptionFilter/http.exception.ts';
import { IJwtService } from '../../core/jwtService/jwt.service.interface.ts';

export class AuthGuard implements IMiddleware {
    constructor(private jwtService: IJwtService) {}

    async execute(req: Request<object, object, Record<string, unknown>>, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new HttpException('Пользователь не авторизован', 401, req.path);
        }

        try {
            const payload = await this.jwtService.verify(token);
            req.user = payload;
        } catch {
            throw new HttpException('Пользователь не авторизован', 401, req.path);
        }
        return next();
    }
}
