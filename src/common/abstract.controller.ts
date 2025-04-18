import { injectable } from 'inversify';
import 'reflect-metadata';
import { IController } from './interfaces/controller.interface';
import { Response, Router } from 'express';
import { IRout } from './interfaces/rout.interface';

@injectable()
export class Controller implements IController {
    router: Router;

    constructor() {
        this.router = Router();
    }

    bindRouts(routs: IRout[]) {
        for (const { path, method, func, middlewares } of routs) {
            const currentMiddlewares = middlewares || [];
            const handlers = [...currentMiddlewares.map((m) => m.execute.bind(m)), func.bind(this)];
            this.router[method](path, handlers);
        }
    }

    send<T extends string | object>(res: Response, status: number, message: T): Response {
        res.status(status);
        return res.send(message);
    }

    ok<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 200, message);
    }

    created<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 201, message);
    }

    badRequest<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 400, message);
    }

    unauthorized<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 401, { error: message });
    }

    notFound<T extends string | object>(res: Response, message: T): Response {
        return this.send(res, 404, message);
    }
}
