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
} from 'contracts-green-shop';
import { CartModel } from '../../common/models/cart-model.ts';

export interface ICartService {
    create(userId: string): Promise<CreateCartResponseDto>;
    createCartItem(
        { quantity, product_variant_id }: CreateCartItemRequestDto,
        cartId: string,
    ): Promise<CreateCartItemRequestResponseDto>;
    deleteCartItem(cartItemUuid: string): Promise<DeleteCartItemResponseDto>;
    getCartItems(cartId: string): Promise<GetCartItemsResponseDto>;
    updateCartItem(
        cartUuid: string,
        cartItemUuid: string,
        { quantity }: UpdateCartItemRequestDto,
    ): Promise<UpdateCartItemRequestResponseDto>;

    getCart(userId: string): Promise<CartModel | null>;
    syncCart(cartId: string, cartItems: SyncCartRequestDto): Promise<SyncCartResponseDto>;
}
