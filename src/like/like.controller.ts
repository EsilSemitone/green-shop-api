import 'reflect-metadata';
import { Controller } from '../common/abstract.controller.ts';
import { IController } from '../common/interfaces/controller.interface.ts';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types.ts';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory.ts';
import { Request, Response } from 'express';
import {
    CreateLikeRequestParamsDto,
    CreateLikeRequestParamsSchema,
    DeleteLikeRequestParamsDto,
    DeleteLikeRequestParamsSchema,
} from 'contracts';
import { ILikeService } from './interfaces/like.service.interface.ts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware.ts';

@injectable()
export class LikeController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.LIKE_SERVICE) private likeService: ILikeService,
    ) {
        super();
        this.bindRouts([
            {
                method: 'post',
                path: '/:targetType/:targetId',
                func: this.createLike,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: CreateLikeRequestParamsSchema }]),
                ],
            },
            {
                method: 'delete',
                path: '/:targetType/:targetId',
                func: this.deleteLike,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteLikeRequestParamsSchema }]),
                ],
            },
        ]);
    }

    async createLike({ user, params }: Request<CreateLikeRequestParamsDto>, res: Response) {
        const userId = user?.userId;
        await this.likeService.createLike(userId!, params.targetId, params.targetType);
        res.sendStatus(201);
    }

    async deleteLike({ user, params }: Request<DeleteLikeRequestParamsDto>, res: Response) {
        const userId = user?.userId;
        await this.likeService.deleteLike(userId!, params.targetId, params.targetType);
        res.sendStatus(200);
    }
}
