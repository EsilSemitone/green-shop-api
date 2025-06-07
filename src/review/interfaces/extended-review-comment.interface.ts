import { ReviewCommentModel } from '../../common/models/review-comments-model.ts';

export interface IExtendedReviewComment extends ReviewCommentModel {
    liked_by_me: boolean;
    name: string;
    image: string | null;
}
