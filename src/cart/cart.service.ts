import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../types.ts';
import { ILogger } from '../core/logger/logger.service.interface.ts';
import { ICartService } from './interfaces/cart.service.interface.ts';
import {
    CreateCartItemRequestDto,
    CreateCartItemRequestResponseDto,
    CreateCartResponseDto,
    DeleteCartItemResponseDto,
    GetCartItemsResponseDto,
    SyncCartRequestDto,
    SyncCartResponseDto,
    UpdateCartItemRequestDto,
    UpdateCartItemRequestResponseDto,
} from 'contracts';
import { ICartRepository } from './interfaces/cart.repository.interface.ts';
import { HttpException } from '../common/exceptionFilter/http.exception.ts';
import { ERROR } from '../common/error/error.ts';
import { IProductRepository } from '../product/interfaces/product.repository.interface.ts';
import { CartModel } from '../common/models/cart-model.ts';
import { ICreateCartItem } from './interfaces/create-cart-item.interface.ts';
import { IUpdateCartItem } from './interfaces/update-cart-item.interface.ts';

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.CART_REPOSITORY) private cartRepository: ICartRepository,
        @inject(APP_TYPES.PRODUCT_REPOSITORY) private productRepository: IProductRepository,
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

    async getCart(userId: string): Promise<CartModel | null> {
        this.loggerService.log(`Start service get cart with params: ${JSON.stringify({ userId })}`);

        const cart = await this.cartRepository.getCartByUniqueCriteria({ user_id: userId });

        this.loggerService.log(`Success service get cart`);
        return cart;
    }

    async createCartItem(
        { quantity, product_variant_id }: CreateCartItemRequestDto,
        cartId: string,
    ): Promise<CreateCartItemRequestResponseDto> {
        this.loggerService.log(`Start service create cart item with params: ${JSON.stringify({ cartId, quantity })}`);

        const isCartItemExist = await this.cartRepository.getCartItemsByCriteria({
            cart_id: cartId,
            product_variant_id,
        });

        if (isCartItemExist.length > 0) {
            this.loggerService.log(`Cart item with product ${product_variant_id} already exist`);
            return isCartItemExist[0];
        }

        const isProductVariantExist = await this.productRepository.getProductVariantByUuid(product_variant_id);

        if (!isProductVariantExist) {
            throw new HttpException(ERROR.PRODUCT_NOT_FOUND, 404);
        }

        const newCartItem = await this.cartRepository.createCartItem({
            cart_id: cartId,
            product_variant_id,
            quantity,
        });

        this.loggerService.log(`Success service create cart item`);
        return newCartItem;
    }

    async deleteCartItem(cartItemUuid: string): Promise<DeleteCartItemResponseDto> {
        this.loggerService.log(`Start service delete cart item with params: ${JSON.stringify({ cartItemUuid })}`);

        const cartItem = await this.cartRepository.getCartItemByUuid(cartItemUuid);

        if (!cartItem) {
            throw new HttpException(ERROR.CART_ITEM_IS_NOT_FOUND, 404);
        }

        await this.cartRepository.deleteCartItem(cartItemUuid);

        this.loggerService.log(`Success service delete cart item`);
        return {
            isSuccess: true,
        };
    }

    async getCartItems(cartId: string): Promise<GetCartItemsResponseDto> {
        this.loggerService.log(`Start service get cart items with params: ${JSON.stringify({ cartId })}`);

        const cartItems = await this.cartRepository.getCartItemsByCriteria({ cart_id: cartId });

        this.loggerService.log(`Success service get cart items`);
        return cartItems;
    }

    async updateCartItem(
        cartUuid: string,
        cartItemUuid: string,
        { quantity }: UpdateCartItemRequestDto,
    ): Promise<UpdateCartItemRequestResponseDto> {
        this.loggerService.log(
            `Start service update cart item with params: ${JSON.stringify({
                cartUuid,
                cartItemUuid,
                quantity,
            })}`,
        );

        const cartItem = await this.cartRepository.getCartItemByUuid(cartItemUuid);

        if (!cartItem || cartItem.cart_id !== cartUuid) {
            throw new HttpException(ERROR.CART_ITEM_IS_NOT_FOUND, 404);
        }

        const updatedCartItem = await this.cartRepository.updateCartItem({
            uuid: cartItemUuid,
            data: {
                quantity,
            },
        });

        this.loggerService.log(`Success service update cart items`);
        return updatedCartItem;
    }

    async syncCart(cartId: string, { items }: SyncCartRequestDto): Promise<SyncCartResponseDto> {
        this.loggerService.log(
            `Start service sync cart items with params: ${JSON.stringify({
                cartId,
                items,
            })}`,
        );

        const currentCartItems = await this.cartRepository.getCartItemsByCriteria({ cart_id: cartId });
        console.log(currentCartItems);

        if (items.length < 1) {
            return currentCartItems;
        }

        const itemsForCreate: ICreateCartItem[] = [];
        const itemsForUpdate: IUpdateCartItem[] = [];

        items.forEach((item) => {
            const currentItem = currentCartItems.find((i) => i.product_variant_id === item.product_variant_id);
            console.log(currentItem);

            if (!currentItem) {
                itemsForCreate.push({ ...item, cart_id: cartId });
            } else if (item.quantity !== currentItem.quantity) {
                itemsForUpdate.push({ uuid: currentItem.uuid, data: { quantity: item.quantity } });
            }
        });

        if (itemsForCreate.length > 0) {
            await this.cartRepository.createCartItem(itemsForCreate);
        }

        if (itemsForUpdate.length > 0) {
            await Promise.all(
                itemsForUpdate.map((i) => {
                    return this.cartRepository.updateCartItem(i);
                }),
            );
        }

        const updatedCurrentCartItems = await this.cartRepository.getCartItemsByCriteria({ cart_id: cartId });

        this.loggerService.log(`Success service sync cart items`);
        return updatedCurrentCartItems.map(({ uuid, product_variant_id, quantity }) => {
            return {
                uuid,
                product_variant_id,
                quantity,
            };
        });
    }
}
