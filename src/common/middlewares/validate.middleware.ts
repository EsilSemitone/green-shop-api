import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface';
import { ZodIssue } from 'zod';
import { HttpException } from '../exceptionFilter/http.exception';
import { ValidateMiddlewareInput } from './types/validate.middleware.types';

export class ValidateMiddleware implements IMiddleware {
    constructor(private input: ValidateMiddlewareInput) {}

    execute({ query, body, params, path }: Request, res: Response, next: NextFunction) {
        const data = { query, body, params };
        const errors: ZodIssue[] = [];

        for (const { key, schema } of this.input) {
            const { error } = schema.safeParse(data[key]);
            if (error) {
                for (const e of error.errors) {
                    errors.push(e);
                }
            }
        }

        if (errors.length > 0) {
            return next(
                new HttpException(
                    errors
                        .map((er) => `path: ${er.path}, error: ${er.code}, description: ${er.message}`)
                        .join(` ::|:: `),
                    400,
                    path,
                ),
            );
        }
        return next();
    }
}