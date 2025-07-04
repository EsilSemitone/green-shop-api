import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { CartModel } from '../common/models/cart-model';
import { IGetCartByUniqueCriteria } from './interfaces/get-cart-by-unique-criteria.interface';
import { IGetCartItemsByCriteria } from './interfaces/get-cart-item-by-criteia.interface';
import { CartItemModel } from '../common/models/cart-item-model';
import { ICreateCartItem } from './interfaces/create-cart-item.interface';
import { IUpdateCartItem } from './interfaces/update-cart-item.interface';

@injectable()
export class cartRepository implements ICartRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async getCartByUniqueCriteria(query: IGetCartByUniqueCriteria): Promise<CartModel | null> {
        const result = await this.db.db<CartModel>('carts').where(query).first();
        return result || null;
    }

    async create(user_id: string): Promise<CartModel> {
        const result = await this.db.db<CartModel>('carts').insert({ user_id }).returning('*');
        return result[0];
    }

    async getCartItemsByCriteria(query: IGetCartItemsByCriteria): Promise<CartItemModel[]> {
        const items = await this.db.db<CartItemModel>('cart_items').where(query);
        return items;
    }

    async getCartItemByUuid(uuid: string): Promise<CartItemModel | null> {
        const item = await this.db.db<CartItemModel>('cart_items').where({ uuid }).first();
        return item || null;
    }

    async createCartItem(data: ICreateCartItem | ICreateCartItem[]): Promise<CartItemModel> {
        const item = await this.db.db<CartItemModel>('cart_items').insert(data).returning('*');
        return item[0];
    }

    async deleteCartItem(uuid: string): Promise<void> {
        await this.db.db<CartItemModel>('cart_items').delete().where({ uuid });
    }

    async updateCartItem({ uuid, data }: IUpdateCartItem): Promise<CartItemModel> {
        const result = await this.db
            .db<CartItemModel>('cart_items')
            .update({ ...data, updated_at: new Date() })
            .where({ uuid })
            .returning('*');
        return result[0];
    }
}
