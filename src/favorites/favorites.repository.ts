import 'reflect-metadata';
import { IFavoritesRepository } from './interfaces/favorites.repository.interface';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { ProductVariantModel } from '../common/models';
import { IGetUniqueFavorites } from './interfaces/get-unique-favorites.interface';
import { IAddToFavorites } from './interfaces/add-to-favorites.interface';
import { FavoritesModel } from '../common/models/favorites-model';
import { IARemoveToFavorites } from './interfaces/remove-to-favorites.interface';
import { IFavoritesProductVariant } from './interfaces/favorites-product-variant';

@injectable()
export class FavoritesRepository implements IFavoritesRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async getAllByUserUuid(userId: string): Promise<IFavoritesProductVariant[]> {
        const res = await this.db.db
            .select([
                'pv.price as price',
                'pv.uuid as product_variant_id',
                'p.uuid as uuid',
                'p.name as name', 
                'p.images',
            ])
            .from('favorites')
            .where({ user_id: userId })
            .join('product_variants as pv', 'favorites.product_variant_id', 'pv.uuid')
            .join('products as p', 'pv.product_id', 'p.uuid');

        const currentRes = res.map(({ images, ...r }) => {
            return {
                ...r,
                price: Number(r.price),
                image: images.length > 0 ? images[0] : null,
            };
        });

        return currentRes;
    }

    async getUniqueFavorites(query: IGetUniqueFavorites): Promise<ProductVariantModel | null> {
        const res: ProductVariantModel | undefined = await this.db.db
            .select('pv.*')
            .from('favorites')
            .where(query)
            .join('product_variants as pv', 'favorites.product_variant_id', 'pv.uuid')
            .first();

        return res || null;
    }

    async addToFavorites(data: IAddToFavorites): Promise<FavoritesModel> {
        const [res] = await this.db.db<FavoritesModel>('favorites').insert(data).returning('*');
        return res;
    }

    async removeToFavorites(data: IARemoveToFavorites): Promise<FavoritesModel> {
        const [res] = await this.db.db<FavoritesModel>('favorites').delete().where(data).returning('*');
        return res;
    }
}
