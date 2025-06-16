import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { ILogger } from '../core/logger/logger.service.interface';
import { AddToFavoritesResponseDto, GetAllFavoritesResponseDto } from 'contracts-green-shop';
import { IFavoritesRepository } from './interfaces/favorites.repository.interface';
import { IFavoritesService } from './interfaces/favorites.service.interface';

@injectable()
export class FavoritesService implements IFavoritesService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.FAVORITES_REPOSITORY) private favoritesRepository: IFavoritesRepository,
    ) {
        this.loggerService.setServiceName(FavoritesService.name);
    }

    async getAll(userId: string): Promise<GetAllFavoritesResponseDto> {
        this.loggerService.log(`Start service getAll with params ${JSON.stringify({ userId })}`);

        const result = await this.favoritesRepository.getAllByUserUuid(userId);

        this.loggerService.log(`Success service getAll`);
        return {
            payload: result,
        };
    }

    async add(userId: string, product_variant_id: string): Promise<AddToFavoritesResponseDto> {
        this.loggerService.log(`Start service add with params ${JSON.stringify({ userId, product_variant_id })}`);

        const isProductVariantInFavorites = await this.favoritesRepository.getUniqueFavorites({
            user_id: userId,
            product_variant_id,
        });

        if (!isProductVariantInFavorites) {
            await this.favoritesRepository.addToFavorites({
                user_id: userId,
                product_variant_id,
            });

            this.loggerService.log(`Success service add`);
            return {
                isSuccess: true,
            };
        }

        this.loggerService.log(`Success service add`);
        return {
            isSuccess: true,
        };
    }

    async remove(userId: string, product_variant_id: string): Promise<AddToFavoritesResponseDto> {
        this.loggerService.log(`Start service remove with params ${JSON.stringify({ userId, product_variant_id })}`);

        const isProductVariantInFavorites = await this.favoritesRepository.getUniqueFavorites({
            user_id: userId,
            product_variant_id,
        });

        if (!isProductVariantInFavorites) {
            this.loggerService.log(`Success service remove`);
            return {
                isSuccess: true,
            };
        }

        await this.favoritesRepository.removeToFavorites({
            user_id: userId,
            product_variant_id,
        });

        this.loggerService.log(`Success service remove`);
        return {
            isSuccess: true,
        };
    }
}
