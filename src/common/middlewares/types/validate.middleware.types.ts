import { Request } from 'express';
import { ZodType } from 'zod';

export type ValidateMiddlewareInputItem = {
    key: keyof Pick<Request, 'body' | 'query' | 'params'>;
    schema: ZodType;
};
export type ValidateMiddlewareInput = ValidateMiddlewareInputItem[];
