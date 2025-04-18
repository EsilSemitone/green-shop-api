import { NextFunction, Request, Response } from 'express';

export interface IExceptionsFilter {
    execute(err: Error, req: Request, res: Response, next: NextFunction): void;
}