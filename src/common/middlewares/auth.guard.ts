import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface';
import { HttpException } from '../exceptionFilter/http.exception';
import { IJwtService } from '../../core/jwtService/jwt.service.interface';

export class AuthGuard implements IMiddleware {
    constructor(private jwtService: IJwtService) {}

    async execute(req: Request<object, object, Record<string, unknown>>, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new HttpException('Пользователь не авторизован', 403, req.path);
        }

        try {
            const payload = await this.jwtService.verify(token);
            req.user = payload;
        } catch {
            throw new HttpException('Пользователь не авторизован', 403, req.path);

        }
        return next();
    }
}
