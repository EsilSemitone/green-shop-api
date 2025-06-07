import { ReviewCommentModel } from '../../common/models/review-comments-model.ts';
import { ReviewModel } from '../../common/models/review-model.ts';
import { ICreateReviewComment } from './create-review-comment.interface.ts';
import { ICreateReview } from './create-review.interface.ts';
import { IGetReviewByCriteria } from './get-review-by-criteria.interface.ts';
import { IGetReviewsByCriteria, IGetReviewsByCriteriaReturn } from './get-reviews-by-criteria.interface.ts';

export interface IReviewRepository {
    getReviewsByCriteria(query: IGetReviewByCriteria): Promise<ReviewModel[]>;
    create(createData: ICreateReview): Promise<ReviewModel>;
    getReviewByUuid(uuid: string): Promise<ReviewModel | null>;
    delete(uuid: string): Promise<void>;
    getReviewsByQueryCriteria({ limit, offset, criteria }: IGetReviewsByCriteria): Promise<IGetReviewsByCriteriaReturn>;
    createReviewComment(query: ICreateReviewComment): Promise<ReviewCommentModel>;
    getReviewCommentByUuid(uuid: string): Promise<ReviewCommentModel | null>;
    deleteReviewComment(uuid: string): Promise<void>;
}
