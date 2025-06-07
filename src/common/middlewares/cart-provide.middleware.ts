import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface.ts';
import { HttpException } from '../exceptionFilter/http.exception.ts';
import { ERROR } from '../error/error.ts';
import { ICartService } from '../../cart/interfaces/cart.service.interface.ts';

export class CartProvideMiddleware implements IMiddleware {
    constructor(private cartService: ICartService) {}

    async execute(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            throw new HttpException(ERROR.UNAUTHORIZED, 401);
        }

        let cart = await this.cartService.getCart(req.user.userId);

        if (!cart) {
            cart = await this.cartService.create(req.user.userId);
        }

        req.cartId = cart.uuid;
        return next();
    }
}
