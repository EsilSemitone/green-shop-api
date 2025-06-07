import { CartItemModel } from '../../common/models/cart-item-model.ts';
import { CartModel } from '../../common/models/cart-model.ts';
import { ICreateCartItem } from './create-cart-item.interface.ts';
import { IGetCartByUniqueCriteria } from './get-cart-by-unique-criteria.interface.ts';
import { IGetCartItemsByCriteria } from './get-cart-item-by-criteia.interface.ts';
import { IUpdateCartItem } from './update-cart-item.interface.ts';

export interface ICartRepository {
    getCartByUniqueCriteria(query: IGetCartByUniqueCriteria): Promise<CartModel | null>;
    create(user_id: string): Promise<CartModel>;
    getCartItemsByCriteria(query: IGetCartItemsByCriteria): Promise<CartItemModel[]>;
    createCartItem(data: ICreateCartItem | ICreateCartItem[]): Promise<CartItemModel>;
    getCartItemByUuid(uuid: string): Promise<CartItemModel | null>;
    deleteCartItem(uuid: string): Promise<void>;
    updateCartItem({ uuid, data }: IUpdateCartItem): Promise<CartItemModel>;
}
