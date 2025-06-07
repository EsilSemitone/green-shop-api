import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../common/abstract.controller.ts';
import { IController } from '../common/interfaces/controller.interface.ts';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory.ts';
import { APP_TYPES } from '../types.ts';
import { Request, Response } from 'express';
import { ICartService } from './interfaces/cart.service.interface.ts';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware.ts';
import {
    CreateCartItemRequestDto,
    CreateCartItemRequestSchema,
    DeleteCartItemRequestParamDto,
    DeleteCartItemRequestParamSchema,
    SyncCartRequestDto,
    SyncCartRequestSchema,
    UpdateCartItemRequestDto,
    UpdateCartItemRequestParamDto,
    UpdateCartItemRequestParamSchema,
    UpdateCartItemRequestSchema,
} from 'contracts';
import { CartProvideMiddleware } from '../common/middlewares/cart-provide.middleware.ts';

@injectable()
export class CartController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.CART_SERVICE) private cartService: ICartService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/sync',
                method: 'post',
                func: this.syncCart,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: SyncCartRequestSchema }]),
                    new CartProvideMiddleware(this.cartService),
                ],
            },
            {
                path: '/item',
                method: 'post',
                func: this.createCartItem,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: CreateCartItemRequestSchema }]),
                    new CartProvideMiddleware(this.cartService),
                ],
            },
            {
                path: '/item',
                method: 'get',
                func: this.getCartItems,
                middlewares: [this.authGuardFactory.create(), new CartProvideMiddleware(this.cartService)],
            },
            {
                path: '/item/:cartItemUuid',
                method: 'delete',
                func: this.deleteCartItem,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteCartItemRequestParamSchema }]),
                ],
            },
            {
                path: '/item/:cartItemUuid',
                method: 'patch',
                func: this.updateCartItem,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([
                        { key: 'params', schema: UpdateCartItemRequestParamSchema },
                        { key: 'body', schema: UpdateCartItemRequestSchema },
                    ]),
                    new CartProvideMiddleware(this.cartService),
                ],
            },
        ]);
    }

    async create({ user }: Request, res: Response) {
        const userId = user?.userId;
        const result = await this.cartService.create(userId!);
        this.ok(res, result);
    }

    async createCartItem({ body, cartId }: Request<object, object, CreateCartItemRequestDto>, res: Response) {
        const result = await this.cartService.createCartItem(body, cartId!);
        this.ok(res, result);
    }

    async deleteCartItem({ params }: Request<DeleteCartItemRequestParamDto>, res: Response) {
        const result = await this.cartService.deleteCartItem(params.cartItemUuid);
        this.ok(res, result);
    }

    async getCartItems({ cartId }: Request, res: Response) {
        const result = await this.cartService.getCartItems(cartId!);
        this.ok(res, result);
    }

    async updateCartItem(
        { params, body, cartId }: Request<UpdateCartItemRequestParamDto, object, UpdateCartItemRequestDto>,
        res: Response,
    ) {
        const result = await this.cartService.updateCartItem(cartId!, params.cartItemUuid, body);
        this.ok(res, result);
    }

    async syncCart({ body, cartId }: Request<object, object, SyncCartRequestDto>, res: Response) {
        const result = await this.cartService.syncCart(cartId!, body);
        this.ok(res, result);
    }
}
