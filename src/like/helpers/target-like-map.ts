import { LIKE_TYPE } from 'contracts';

export const targetLikeMap = new Map<LIKE_TYPE, string>([
    [LIKE_TYPE.REVIEW, 'reviews'],
    [LIKE_TYPE.REVIEW_COMMENT, 'review_comments'],
]);
