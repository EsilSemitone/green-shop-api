import { AddToFavoritesResponseDto, GetAllFavoritesResponseDto } from 'contracts-green-shop';

export interface IFavoritesService {
    getAll(userId: string): Promise<GetAllFavoritesResponseDto>;
    add(userId: string, product_variant_id: string): Promise<AddToFavoritesResponseDto>;
    remove(userId: string, product_variant_id: string): Promise<AddToFavoritesResponseDto>;
}
