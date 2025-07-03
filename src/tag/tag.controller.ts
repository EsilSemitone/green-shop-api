import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { RoleGuard } from '../common/middlewares/role.guard';
import {
    CreateTagRequestDto,
    CreateTagRequestSchema,
    DeleteTagRequestParamsDto,
    DeleteTagRequestParamsSchema,
    ROLES,
} from 'contracts-green-shop';
import { Request, Response } from 'express';
import { ITagService } from './interfaces/tag.service.interface';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';

@injectable()
export class TagController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.TAG_SERVICE) private tagService: ITagService,
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
    ) {
        super();
        this.bindRouts([
            {
                path: '/',
                method: 'get',
                func: this.getAll,
                middlewares: [],
            },
            {
                path: '/',
                method: 'post',
                func: this.create,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'body', schema: CreateTagRequestSchema }]),
                ],
            },
            {
                path: '/:tagUuid',
                method: 'delete',
                func: this.delete,
                middlewares: [
                    this.authGuardFactory.create(),
                    new RoleGuard([ROLES.ADMIN]),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteTagRequestParamsSchema }]),
                ],
            },
        ]);
    }

    async getAll(req: Request, res: Response) {
        const result = await this.tagService.getAll();
        this.ok(res, result);
    }

    async create({ body }: Request<object, object, CreateTagRequestDto>, res: Response) {
        const result = await this.tagService.create(body);
        this.ok(res, result);
    }

    async delete({ params }: Request<DeleteTagRequestParamsDto>, res: Response) {
        const result = await this.tagService.delete(params.tagUuid);
        this.ok(res, result);
    }
}
