import { ORDER_BY_REVIEWS, ORDER_BY_REVIEWS_ENUM } from 'contracts-green-shop';

export const orderByMap = new Map<ORDER_BY_REVIEWS, [string, string]>([
    [ORDER_BY_REVIEWS_ENUM.FIRST_NEW, ['reviews.created_at', 'desc']],
    [ORDER_BY_REVIEWS_ENUM.FIRST_OLD, ['reviews.created_at', 'asc']],
    [ORDER_BY_REVIEWS_ENUM.FIRST_POPULAR, ['reviews.likes_count', 'desc']],
]);
