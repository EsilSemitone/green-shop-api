import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface.ts';
import { ZodIssue } from 'zod';
import { HttpException } from '../exceptionFilter/http.exception.ts';
import { ValidateMiddlewareInput } from './types/validate.middleware.types.ts';

export class ValidateMiddleware implements IMiddleware {
    constructor(private input: ValidateMiddlewareInput) {}

    execute(req: Request, res: Response, next: NextFunction) {
        const errors: ZodIssue[] = [];

        for (const { key, schema } of this.input) {
            const { error, data: parseResult } = schema.safeParse(req[key]);
            if (error) {
                for (const e of error.errors) {
                    errors.push(e);
                }
            } else {
                if (key != 'params') {
                    Object.defineProperty(req, key, {
                        value: parseResult,
                        writable: false,
                        configurable: true,
                        enumerable: true,
                    });
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
                    req.path,
                ),
            );
        }

        return next();
    }
}
