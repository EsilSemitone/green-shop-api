import { CartModel } from '../../common/models/cart-model';
import { IGetCartByUniqueCriteria } from './get-cart-by-unique-criteria.interface';

export interface ICartRepository {
    getCartByUniqueCriteria(query: IGetCartByUniqueCriteria): Promise<CartModel | null>;
    create(user_id: string): Promise<CartModel>;
}
