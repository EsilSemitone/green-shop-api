import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import { ICartService } from './interfaces/cart.service.interface';
import { ERROR } from '../common/error/error';

@injectable()
export class CartController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.CART_SERVICE) private cartService: ICartService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'post',
                func: this.create,
                middlewares: [this.authGuardFactory.create()],
            },
        ]);
    }

    async create({ user }: Request, res: Response) {
        if (!user) {
            this.unauthorized(res, ERROR.UNAUTHORIZED);
            return;
        }
        const result = await this.cartService.create(user.userId);
        this.ok(res, result);
    }
}
