import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types.ts';
import { IDatabaseService } from '../core/database/database.service.interface.ts';
import { ICreateRefreshToken } from './interfaces/create-refresh-token.interface.ts';
import { RefreshTokenModel } from '../common/models/refresh-token-model.interface.ts';
import { IRefreshTokenRepository } from './interfaces/refresh-token.repository.interface.ts';
import { IGetTokenByUniqueCriteria } from './interfaces/get-token-by-unique-criteria.interface.ts';

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {}

    async create(data: ICreateRefreshToken): Promise<void> {
        await this.databaseService.db<RefreshTokenModel>('refresh_tokens').insert({
            ...data,
        });
    }

    async tokenDisable(userId: string, token: string): Promise<void> {
        await this.databaseService.db<RefreshTokenModel>('refresh_tokens').where({ uuid: userId, token }).update({
            is_valid: false,
        });
    }

    async getById(uuid: string): Promise<RefreshTokenModel[]> {
        return this.databaseService.db<RefreshTokenModel>('refresh_tokens').where({ uuid });
    }

    async getByUniqueCriteria(data: IGetTokenByUniqueCriteria): Promise<RefreshTokenModel | null> {
        const res = await this.databaseService
            .db<RefreshTokenModel>('refresh_tokens')
            .where({ ...data })
            .first();

        return res || null;
    }

    async deleteById(uuid: string): Promise<void> {
        await this.databaseService.db<RefreshTokenModel>('refresh_tokens').where({ uuid }).delete();
    }
}
