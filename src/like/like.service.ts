import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ILikeService } from './interfaces/like.service.interface';
import { APP_TYPES } from '../types';
import { ILogger } from '../core/logger/logger.service.interface';
import { LIKE_TYPE } from 'contracts-green-shop';
import { ILikeRepository } from './interfaces/like.repository';

@injectable()
export class LikeService implements ILikeService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.LIKE_REPOSITORY) private likeRepository: ILikeRepository,
    ) {
        this.loggerService.setServiceName(LikeService.name);
    }

    async createLike(userId: string, targetId: string, targetType: LIKE_TYPE): Promise<void> {
        this.loggerService.log(
            `Start service createLike with params ${JSON.stringify({ userId, targetId, targetType })}`,
        );

        await this.likeRepository.createLike(userId, targetId, targetType);
        this.loggerService.log('`Success service createLike');
    }

    async deleteLike(userId: string, targetId: string, targetType: LIKE_TYPE): Promise<void> {
        this.loggerService.log(
            `Start service deleteLike with params ${JSON.stringify({ userId, targetId, targetType })}`,
        );

        await this.likeRepository.deleteLike(userId, targetId, targetType);
        this.loggerService.log('`Success service deleteLike');
    }
}
