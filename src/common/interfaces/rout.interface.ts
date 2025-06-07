import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface.ts';

export interface IRout {
    path: string;
    method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'delete' | 'put'>;
    func: (req: Request<any, any, any, any, any>, res: Response, next: NextFunction) => void | Promise<void>;
    middlewares?: IMiddleware[];
}
