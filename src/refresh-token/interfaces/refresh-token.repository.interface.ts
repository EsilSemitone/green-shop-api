import { RefreshTokenModel } from '../../common/models/refresh-token-model.interface.ts';
import { ICreateRefreshToken } from './create-refresh-token.interface.ts';
import { IGetTokenByUniqueCriteria } from './get-token-by-unique-criteria.interface.ts';

export interface IRefreshTokenRepository {
    create(data: ICreateRefreshToken): Promise<void>;
    tokenDisable(userId: string, token: string): Promise<void>;
    getById(uuid: string): Promise<RefreshTokenModel[]>;
    deleteById(uuid: string): Promise<void>;
    getByUniqueCriteria(data: IGetTokenByUniqueCriteria): Promise<RefreshTokenModel | null>;
}
