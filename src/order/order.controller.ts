import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { Request, Response } from 'express';
import { APP_TYPES } from '../types';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';
import {
    CreateOrderRequestDto,
    CreateOrderRequestSchema,
    GetOrderDetailsRequestParamsDto,
    GetOrderDetailsRequestParamsSchema,
} from 'contracts-green-shop';
import { IOrderService } from './interfaces/order.service.interface';
import { CartProvideMiddleware } from '../common/middlewares/cart-provide.middleware';
import { ICartService } from '../cart/interfaces/cart.service.interface';

@injectable()
export class OrderController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.ORDER_SERVICE) private orderService: IOrderService,
        @inject(APP_TYPES.CART_SERVICE) private cartService: ICartService,
    ) {
        super();

        this.bindRouts([
            {
                path: '/',
                method: 'post',
                func: this.create,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: CreateOrderRequestSchema }]),
                    new CartProvideMiddleware(this.cartService),
                ],
            },
            {
                path: '/my',
                method: 'get',
                func: this.getMyOrders,
                middlewares: [this.authGuardFactory.create()],
            },
            {
                path: '/:orderId',
                method: 'get',
                func: this.getOrderDetails,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: GetOrderDetailsRequestParamsSchema }]),
                ],
            },
        ]);
    }

    async create({ user, cartId, body }: Request<object, object, CreateOrderRequestDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.orderService.create(userId!, cartId!, body);
        this.ok(res, result);
    }

    async getMyOrders({ user }: Request, res: Response) {
        const userId = user?.userId;
        const result = await this.orderService.getMyOrders(userId!);
        this.ok(res, result);
    }

    async getOrderDetails({ params }: Request<GetOrderDetailsRequestParamsDto>, res: Response) {
        const result = await this.orderService.getOrderDetails(params.orderId);
        this.ok(res, result);
    }
}
