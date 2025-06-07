import { FavoritesModel } from '../../common/models/favorites-model.ts';
import { ProductVariantModel } from '../../common/models/product-variant-model.ts';
import { IAddToFavorites } from './add-to-favorites.interface.ts';
import { IFavoritesProductVariant } from './favorites-product-variant.ts';
import { IGetUniqueFavorites } from './get-unique-favorites.interface.ts';
import { IARemoveToFavorites } from './remove-to-favorites.interface.ts';

export interface IFavoritesRepository {
    getAllByUserUuid(userId: string): Promise<IFavoritesProductVariant[]>;
    getUniqueFavorites(query: IGetUniqueFavorites): Promise<ProductVariantModel | null>;
    addToFavorites(data: IAddToFavorites): Promise<FavoritesModel>;
    removeToFavorites(data: IARemoveToFavorites): Promise<FavoritesModel>;
}
