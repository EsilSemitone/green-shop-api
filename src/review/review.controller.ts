import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IController } from '../common/interfaces/controller.interface.ts';
import { Controller } from '../common/abstract.controller.ts';
import { APP_TYPES } from '../types.ts';
import { AuthGuardFactory } from '../common/middlewares/auth.guard.factory.ts';
import { Request, Response } from 'express';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware.ts';
import {
    CreateReviewCommentRequestDto,
    CreateReviewCommentRequestParamsDto,
    CreateReviewCommentRequestParamsSchema,
    CreateReviewCommentRequestSchema,
    CreateReviewRequestDto,
    CreateReviewRequestSchema,
    DeleteReviewCommentRequestParamsDto,
    DeleteReviewCommentRequestParamsSchema,
    DeleteReviewRequestParamsDto,
    DeleteReviewRequestParamsSchema,
    GetProductReviewsRequestParamsDto,
    GetProductReviewsRequestParamsSchema,
    GetProductReviewsRequestQueryDto,
    GetProductReviewsRequestQuerySchema,
} from 'contracts';
import { IReviewService } from './interfaces/review.service.interface.ts';
import { AuthMiddleware } from '../common/middlewares/auth.middleware.ts';

@injectable()
export class ReviewController extends Controller implements IController {
    constructor(
        @inject(APP_TYPES.REVIEW_SERVICE) private reviewService: IReviewService,
        @inject(APP_TYPES.AUTH_GUARD_FACTORY) private authGuardFactory: AuthGuardFactory,
        @inject(APP_TYPES.AUTH_MIDDLEWARE) private authMiddleware: AuthMiddleware,
    ) {
        super();

        this.bindRouts([
            {
                method: 'post',
                path: '/',
                func: this.createReview,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'body', schema: CreateReviewRequestSchema }]),
                ],
            },
            {
                method: 'delete',
                path: '/:reviewId',
                func: this.deleteReview,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteReviewRequestParamsSchema }]),
                ],
            },
            {
                method: 'post',
                path: '/:reviewId/comment',
                func: this.createReviewComment,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([
                        { key: 'params', schema: CreateReviewCommentRequestParamsSchema },
                        { key: 'body', schema: CreateReviewCommentRequestSchema },
                    ]),
                ],
            },
            {
                method: 'delete',
                path: '/:reviewId/comment/:commentId',
                func: this.deleteReviewComment,
                middlewares: [
                    this.authGuardFactory.create(),
                    new ValidateMiddleware([{ key: 'params', schema: DeleteReviewCommentRequestParamsSchema }]),
                ],
            },
            {
                method: 'get',
                path: '/product/:productId',
                func: this.getProductReviews,
                middlewares: [
                    authMiddleware,
                    new ValidateMiddleware([
                        { key: 'params', schema: GetProductReviewsRequestParamsSchema },
                        { key: 'query', schema: GetProductReviewsRequestQuerySchema },
                    ]),
                ],
            },
        ]);
    }

    async createReview({ user, body }: Request<object, object, CreateReviewRequestDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.reviewService.createReview(userId!, body);
        this.created(res, result);
    }

    async deleteReview({ user, params }: Request<DeleteReviewRequestParamsDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.reviewService.deleteReview(userId!, params.reviewId);
        this.ok(res, result);
    }

    async getProductReviews(
        {
            params,
            query,
            user,
        }: Request<GetProductReviewsRequestParamsDto, object, object, GetProductReviewsRequestQueryDto>,
        res: Response,
    ) {
        const result = await this.reviewService.getProductReviews(user?.userId, params.productId, query);
        this.ok(res, result);
    }

    async createReviewComment(
        { user, body, params }: Request<CreateReviewCommentRequestParamsDto, object, CreateReviewCommentRequestDto>,
        res: Response,
    ) {
        const userId = user?.userId;
        const result = await this.reviewService.createReviewComment(userId!, params.reviewId, body);
        this.created(res, result);
    }

    async deleteReviewComment({ user, params }: Request<DeleteReviewCommentRequestParamsDto>, res: Response) {
        const userId = user?.userId;
        const result = await this.reviewService.deleteReviewComment(userId!, params.reviewId, params.commentId);
        this.created(res, result);
    }
}
