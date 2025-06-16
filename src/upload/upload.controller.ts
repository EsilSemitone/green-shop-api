import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { APP_TYPES } from '../types';
import { IS3Service } from '../integration/s3/interfaces/s3.service.interface';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { Request, Response } from 'express';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';
import multer from 'multer';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import { UploadRequestDto, UploadRequestSchema } from 'contracts-green-shop';

@injectable()
export class UploadController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.S3_SERVICE) private s3Service: IS3Service,
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'post',
                func: this.upload,
                middlewares: [
                    authGuardFactory.create(),
                    { execute: multer().single('file') },
                    new ValidateMiddleware([{ key: 'body', schema: UploadRequestSchema }]),
                ],
            },
        ]);
    }

    async upload({ file, body }: Request<object, object, UploadRequestDto>, res: Response) {
        if (!file) {
            throw new HttpException(ERROR.EXPECTED_FILES, 400);
        }

        const result = await this.s3Service.uploadFile(body.path, file);
        this.ok(res, {
            file: result,
        });
    }
}
