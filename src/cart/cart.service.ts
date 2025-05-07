import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../types';
import { ILogger } from '../core/logger/logger.service.interface';
import { ICartService } from './interfaces/cart.service.interface';
import { CreateCartResponseDto } from 'contracts';
import { ICartRepository } from './interfaces/cart.repository.interface';

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.CART_REPOSITORY) private cartRepository: ICartRepository,
    ) {
        this.loggerService.setServiceName(CartService.name);
    }

    async create(userId: string): Promise<CreateCartResponseDto> {
        this.loggerService.log(`Start service create cart with params: ${JSON.stringify({ userId })}`);

        const isCartExist = await this.cartRepository.getCartByUniqueCriteria({ user_id: userId });

        if (isCartExist) {
            this.loggerService.log(`User ${userId} already has cart`);
            return isCartExist;
        }

        const newCart = await this.cartRepository.create(userId);
        
        this.loggerService.log(`Success service create cart`);
        return newCart;
    }
}
