import { LIKE_TYPE } from 'contracts-green-shop';

export interface LikeModel {
    uuid: string;
    user_id: string;
    target_id: string;
    target_type: LIKE_TYPE;
    created_at: Date;
    updated_at: Date;
}
