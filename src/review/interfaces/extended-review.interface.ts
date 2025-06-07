import { ReviewModel } from '../../common/models/review-model.ts';
import { IExtendedReviewComment } from './extended-review-comment.interface.ts';

export interface IExtendedReview extends ReviewModel {
    name: string;
    image: string | null;
    liked_by_me: boolean;
    comments: IExtendedReviewComment[];
}
