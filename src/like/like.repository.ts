import 'reflect-metadata';
import { ILikeRepository } from './interfaces/like.repository.ts';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types.ts';
import { IDatabaseService } from '../core/database/database.service.interface.ts';
import { LIKE_TYPE } from 'contracts';
import { targetLikeMap } from './helpers/target-like-map.ts';
import { ERROR } from '../common/error/error.ts';
import { HttpException } from '../common/exceptionFilter/http.exception.ts';
import { LikeModel } from '../common/models/like-model.ts';

@injectable()
export class likeRepository implements ILikeRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async createLike(user_id: string, target_id: string, target_type: LIKE_TYPE): Promise<void> {
        await this.db.db.transaction(async (trx) => {
            const tableName = targetLikeMap.get(target_type);

            if (!tableName) {
                throw new HttpException(ERROR.INVALID_LIKE_TARGET_NAME, 500); //Этой ошибки быть не должно
            }

            try {
                await trx('likes').insert({ user_id, target_id, target_type });
            } catch {
                throw new HttpException(ERROR.LIKE_ALREADY_ExIST, 409);
            }

            try {
                await trx(tableName).where({ uuid: target_id }).increment('likes_count', 1);
            } catch {
                throw new HttpException(ERROR.ENTITY_NOT_FOUND, 404);
            }
        });
    }

    async deleteLike(user_id: string, target_id: string, target_type: LIKE_TYPE): Promise<void> {
        await this.db.db.transaction(async (trx) => {
            const tableName = targetLikeMap.get(target_type);

            if (!tableName) {
                throw new HttpException(ERROR.INVALID_LIKE_TARGET_NAME, 500); //Этой ошибки быть не должно
            }
            let deleteCount = 0;

            try {
                deleteCount = await trx('likes').where({ user_id, target_id, target_type }).delete();
            } catch {
                throw new HttpException(ERROR.USER_DONT_HAVE_A_LIKE, 409);
            }

            if (deleteCount === 0) {
                throw new HttpException(ERROR.ENTITY_NOT_FOUND, 404);
            }
            await trx(tableName).where({ uuid: target_id }).decrement('likes_count', 1);
        });
    }

    async deleteTargetLikes(target_id: string, target_type: LIKE_TYPE): Promise<void> {
        await this.db.db<LikeModel>('likes').where({ target_id, target_type }).delete();
    }
}
