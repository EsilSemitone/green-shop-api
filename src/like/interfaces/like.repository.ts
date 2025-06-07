import { LIKE_TYPE } from 'contracts';

export interface ILikeRepository {
    createLike(user_id: string, target_id: string, target_type: LIKE_TYPE): Promise<void>;
    deleteLike(user_id: string, target_id: string, target_type: LIKE_TYPE): Promise<void>;
    deleteTargetLikes(target_id: string, target_type: LIKE_TYPE): Promise<void>;
}
