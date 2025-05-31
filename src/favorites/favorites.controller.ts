import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { IFavoritesService } from './interfaces/favorites.service.interface';
import {
    AddToFavoritesRequestDto,
    AddToFavoritesRequestSchema,
    RemoveToFavoritesRequestDto,
    RemoveToFavoritesRequestSchema,
} from 'contracts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';

@injectable()
export class FavoritesController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.FAVORITES_SERVICE) private favoritesService: IFavoritesService,
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
    ) {
        super();
        this.bindRouts([
            {
                path: '/',
                method: 'get',
                func: this.getAll,
                middlewares: [this.authGuardFactory.create()],
            },
            {
                path: '/',
                method: 'post',
                func: this.add,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: AddToFavoritesRequestSchema }]),
                ],
            },
            {
                path: '/',
                method: 'delete',
                func: this.remove,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: RemoveToFavoritesRequestSchema }]),
                ],
            },
        ]);
    }

    async getAll({ user }: Request, res: Response) {
        const userId = user?.userId;
        const result = await this.favoritesService.getAll(userId!);
        this.ok(res, result);
    }

    async add({ user, body }: Request<object, object, AddToFavoritesRequestDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.favoritesService.add(userId!, body.product_variant_id);
        this.ok(res, result);
    }

    async remove({ user, body }: Request<object, object, RemoveToFavoritesRequestDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.favoritesService.remove(userId!, body.product_variant_id);
        this.ok(res, result);
    }
}
