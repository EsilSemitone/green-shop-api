import { ProductVariantModel } from '../../common/models';
import { FavoritesModel } from '../../common/models/favorites-model';
import { IAddToFavorites } from './add-to-favorites.interface';
import { IFavoritesProductVariant } from './favorites-product-variant';
import { IGetUniqueFavorites } from './get-unique-favorites.interface';
import { IARemoveToFavorites } from './remove-to-favorites.interface';

export interface IFavoritesRepository {
    getAllByUserUuid(userId: string): Promise<IFavoritesProductVariant[]>;
    getUniqueFavorites(query: IGetUniqueFavorites): Promise<ProductVariantModel | null>;
    addToFavorites(data: IAddToFavorites): Promise<FavoritesModel>;
    removeToFavorites(data: IARemoveToFavorites): Promise<FavoritesModel>;
}
