import { Request, Response, NextFunction} from "express";
import { IMiddleware } from "../interfaces/middleware.interface";
import { ZodType } from "zod";
import { HttpException } from "../exceptionFilter/http.exception";

export class ValidateMiddleware implements IMiddleware {

    constructor(private schema: ZodType) {

    }

    execute({ body, path}: Request<object, object, Record<string, unknown>>, res: Response, next: NextFunction) {
        const {error} = this.schema.safeParse(body)
        if (error) {
            return next(new HttpException(error.errors.map(e => `path: ${e.path}, error: ${e.code}, description: ${e.message}`).join(` ::|:: `), 400, path))
        }
        return next()
    }
    
}