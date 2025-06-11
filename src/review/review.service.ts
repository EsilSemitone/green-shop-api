import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IReviewService } from './interfaces/review.service.interface.ts';
import { APP_TYPES } from '../types.ts';
import { ILogger } from '../core/logger/logger.service.interface.ts';
import {
    CreateReviewCommentRequestDto,
    CreateReviewCommentResponseDto,
    CreateReviewRequestDto,
    CreateReviewResponseDto,
    DeleteReviewCommentResponseDto,
    DeleteReviewResponseDto,
    GetMyReviewsResponseDto,
    GetProductReviewsRequestQueryDto,
    LIKE_TYPE,
} from 'contracts-green-shop';
import { IOrderService } from '../order/interfaces/order.service.interface.ts';
import { HttpException } from '../common/exceptionFilter/http.exception.ts';
import { ERROR } from '../common/error/error.ts';
import { IReviewRepository } from './interfaces/review.repository.interface.ts';
import { IProductRepository } from '../product/interfaces/product.repository.interface.ts';
import { ILikeRepository } from '../like/interfaces/like.repository.ts';

@injectable()
export class ReviewService implements IReviewService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.REVIEW_REPOSITORY) private reviewRepository: IReviewRepository,
        @inject(APP_TYPES.ORDER_SERVICE) private orderService: IOrderService,
        @inject(APP_TYPES.PRODUCT_REPOSITORY) private productRepository: IProductRepository,
        @inject(APP_TYPES.LIKE_REPOSITORY) private likeRepository: ILikeRepository,
    ) {
        this.loggerService.setServiceName(ReviewService.name);
    }

    async createReview(userId: string, dto: CreateReviewRequestDto): Promise<CreateReviewResponseDto> {
        this.loggerService.log(`Start service createReview with params: ${JSON.stringify({ userId, ...dto })}`);

        const productVariants = await this.productRepository.getProductVariantsByProduct(dto.product_id);
        const productHasVariant = Boolean(productVariants.find((v) => v.uuid === dto.product_variant_id));

        if (!productHasVariant) {
            throw new HttpException(ERROR.PRODUCT_VARIANT_NOT_FOUND, 404);
        }

        const userReviews = await this.reviewRepository.getReviewsByCriteria({
            user_id: userId,
            product_variant_id: dto.product_variant_id,
        });

        const isReviewOnProductVariantExist = userReviews.length > 0;

        if (isReviewOnProductVariantExist) {
            throw new HttpException(ERROR.REVIEW_ALREADY_EXIST, 409);
        }

        const isHasPurchased = await this.orderService.hasUserPurchasedProduct(userId, dto.product_variant_id);
        const createData = {
            ...dto,
            user_id: userId,
            verified: isHasPurchased ? true : false,
        };

        const newReview = await this.reviewRepository.create(createData);
        this.loggerService.log(`Success service createReview `);
        return newReview;
    }

    async deleteReview(userId: string, reviewId: string): Promise<DeleteReviewResponseDto> {
        this.loggerService.log(`Start service deleteReview with params: ${JSON.stringify({ userId, reviewId })}`);

        const review = await this.reviewRepository.getReviewByUuid(reviewId);
        if (!review) {
            this.loggerService.log(`Success service deleteReview`);
            return {
                isSuccess: true,
            };
        }

        if (userId !== review.user_id) {
            throw new HttpException(ERROR.USER_NOT_A_HAVE_REVIEW, 400);
        }

        await this.reviewRepository.delete(reviewId);
        await this.likeRepository.deleteTargetLikes(reviewId, LIKE_TYPE.REVIEW);
        this.loggerService.log(`Success service deleteReview`);
        return {
            isSuccess: true,
        };
    }

    async getProductReviews(
        userId: string | undefined,
        productId: string,
        { limit, offset, ...other }: GetProductReviewsRequestQueryDto,
    ): Promise<GetMyReviewsResponseDto> {
        this.loggerService.log(
            `Start service getProductReviews with params: ${JSON.stringify({
                productId,
                limit,
                offset,
                ...other,
            })}`,
        );

        const { reviews, count } = await this.reviewRepository.getReviewsByQueryCriteria({
            limit,
            offset,
            criteria: { ...other, product_id: productId },
            includeIsLikeUserId: userId,
        });
        const page = Math.floor(offset / limit) + 1;
        const totalPage = Math.ceil(count / limit);

        this.loggerService.log(`Success service getProductReviews`);

        return {
            reviews,
            page,
            totalPage,
        };
    }

    async createReviewComment(
        userId: string,
        reviewId: string,
        { content }: CreateReviewCommentRequestDto,
    ): Promise<CreateReviewCommentResponseDto> {
        this.loggerService.log(
            `Start service createReviewComment with params: ${JSON.stringify({
                userId,
                reviewId,
                content,
            })}`,
        );

        const isReviewExist = await this.reviewRepository.getReviewByUuid(reviewId);

        if (!isReviewExist) {
            throw new HttpException(ERROR.REVIEW_NOT_FOUND, 404);
        }

        const reviewComment = await this.reviewRepository.createReviewComment({
            user_id: userId,
            review_id: reviewId,
            content,
        });

        this.loggerService.log(`Success service createReviewComment`);

        return reviewComment;
    }

    async deleteReviewComment(
        userId: string,
        reviewId: string,
        commentId: string,
    ): Promise<DeleteReviewCommentResponseDto> {
        this.loggerService.log(
            `Start service deleteReviewComment with params: ${JSON.stringify({
                userId,
                reviewId,
                commentId,
            })}`,
        );

        const isReviewExist = await this.reviewRepository.getReviewByUuid(reviewId);

        if (!isReviewExist) {
            throw new HttpException(ERROR.REVIEW_NOT_FOUND, 404);
        }

        const isCommentExist = await this.reviewRepository.getReviewCommentByUuid(commentId);

        if (!isCommentExist) {
            throw new HttpException(ERROR.REVIEW_COMMENT_NOT_FOUND, 404);
        }

        if (isCommentExist.user_id !== userId) {
            throw new HttpException(ERROR.REVIEW_HAS_DIFFERENT_USER_OWNER, 409);
        }

        await this.reviewRepository.deleteReviewComment(commentId);
        await this.likeRepository.deleteTargetLikes(reviewId, LIKE_TYPE.REVIEW_COMMENT);

        this.loggerService.log(`Success service deleteReviewComment`);

        return {
            isSuccess: true,
        };
    }
}
