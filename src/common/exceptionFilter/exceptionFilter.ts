import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { APP_TYPES } from '../../types';
import { ILogger } from '../../core/logger/logger.service.interface.ts';
import { HttpException } from './http.exception';
import { IExceptionsFilter } from './exceptionFilter.interface';

@injectable()
export class ExceptionsFilter implements IExceptionsFilter {
    constructor(@inject(APP_TYPES.LOGGER_SERVICE) private logger: ILogger) {
        this.logger.setServiceName(ExceptionsFilter.name);
    }

    execute(err: Error | HttpException, req: Request, res: Response, _: NextFunction): void {
        if (err instanceof HttpException) {
            this.logger.error(
                `[${err.context || ''}] ${err.path || req.path} ${err.message}  ${err.code}`,
            );
            res.status(err.code);
            res.send({
                error: err.message,
                code: err.code,
                path: err.path && req.path,
            });
        } else {
            this.logger.error(`${err.message}`);
            res.status(500);
            res.send({ error: 'internal server error', code: 500, path: req.path });
        }
        this.logger.error(`[${err.stack}`);
    }
}
