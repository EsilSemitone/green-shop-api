import { LIKE_TYPE } from 'contracts-green-shop';

export interface ILikeService {
    createLike(userId: string, targetId: string, targetType: LIKE_TYPE): Promise<void>;
    deleteLike(userId: string, targetId: string, targetType: LIKE_TYPE): Promise<void>;
}
