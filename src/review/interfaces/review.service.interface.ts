import {
    CreateReviewCommentRequestDto,
    CreateReviewCommentResponseDto,
    CreateReviewRequestDto,
    CreateReviewResponseDto,
    DeleteReviewCommentResponseDto,
    DeleteReviewResponseDto,
    GetMyReviewsResponseDto,
    GetProductReviewsRequestQueryDto,
} from 'contracts-green-shop';

export interface IReviewService {
    createReview(userId: string, dto: CreateReviewRequestDto): Promise<CreateReviewResponseDto>;
    deleteReview(userId: string, reviewId: string): Promise<DeleteReviewResponseDto>;
    getProductReviews(
        userId: string | undefined,
        productId: string,
        { limit, offset, ...other }: GetProductReviewsRequestQueryDto,
    ): Promise<GetMyReviewsResponseDto>;
    createReviewComment(
        userId: string,
        reviewId: string,
        { content }: CreateReviewCommentRequestDto,
    ): Promise<CreateReviewCommentResponseDto>;
    deleteReviewComment(userId: string, reviewId: string, commentId: string): Promise<DeleteReviewCommentResponseDto>;
}
