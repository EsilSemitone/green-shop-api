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
import { CartModel } from '../../common/models/cart-model';

export interface ICartService {
    create(userId: string): Promise<CreateCartResponseDto>;
    createCartItem({ quantity }: CreateCartItemRequestDto, userId: string): Promise<CreateCartItemRequestResponseDto>;
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
