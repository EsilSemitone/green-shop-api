import { RefreshTokenModel } from '../../common/models/refresh-token-model.interface';
import { ICreateRefreshToken } from './create-refresh-token.interface';

export interface IRefreshTokenRepository {
    create(data: ICreateRefreshToken): Promise<void>;
    tokenDisable(userId: string, token: string): Promise<void>;
    getById(uuid: string): Promise<RefreshTokenModel[]>;
    deleteById(uuid: string): Promise<void>;
}
