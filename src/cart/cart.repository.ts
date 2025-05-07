import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ICartRepository } from './interfaces/cart.repository.interface';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { CartModel } from '../common/models/cart-model';
import { IGetCartByUniqueCriteria } from './interfaces/get-cart-by-unique-criteria.interface';

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
}
