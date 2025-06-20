import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface';
import { ROLES } from 'contracts-green-shop';
import { HttpException } from '../exceptionFilter/http.exception';

export class RoleGuard implements IMiddleware {
    constructor(private roles: ROLES[]) {}

    async execute(req: Request<object, object, Record<string, unknown>>, res: Response, next: NextFunction) {
        const user = req.user;
        if (!user) {
            throw new HttpException('Пользователь не авторизован', 401, req.path);
        }

        const userHasAccess = this.roles.includes(user.role);

        if (!userHasAccess) {
            throw new HttpException('У пользователя недостаточно прав', 403, req.path);
        }
        return next();
    }
}
