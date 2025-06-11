import { ORDER_BY_REVIEWS } from 'contracts-green-shop/enums/order-by-my-reviews.ts';
import { IExtendedReview } from './extended-review.interface.ts';

export interface IGetReviewsByCriteria {
    limit: number;
    offset: number;
    criteria: {
        user_id?: string;
        orderBy?: ORDER_BY_REVIEWS;
        product_id?: string;
        variant_id?: string;
    };
    includeIsLikeUserId?: string;
}

export interface IGetReviewsByCriteriaReturn {
    count: number;
    reviews: IExtendedReview[];
}
