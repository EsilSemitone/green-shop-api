import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IReviewRepository } from './interfaces/review.repository.interface.ts';
import { APP_TYPES } from '../types.ts';
import { IDatabaseService } from '../core/database/database.service.interface.ts';
import { IGetReviewByCriteria } from './interfaces/get-review-by-criteria.interface.ts';
import { ReviewModel } from '../common/models/review-model.ts';
import { ICreateReview } from './interfaces/create-review.interface.ts';
import { IGetReviewsByCriteria, IGetReviewsByCriteriaReturn } from './interfaces/get-reviews-by-criteria.interface.ts';
import { orderByMap } from './helpers/order-by-map.ts';
import { ReviewCommentModel } from '../common/models/review-comments-model.ts';
import { ICreateReviewComment } from './interfaces/create-review-comment.interface.ts';

@injectable()
export class ReviewRepository implements IReviewRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async getReviewByUuid(uuid: string): Promise<ReviewModel | null> {
        const res = await this.db.db<ReviewModel>('reviews').where({ uuid }).first();
        return res || null;
    }

    async getReviewsByCriteria(query: IGetReviewByCriteria): Promise<ReviewModel[]> {
        const res = await this.db.db<ReviewModel>('reviews').where(query);
        return res;
    }

    async create(createData: ICreateReview): Promise<ReviewModel> {
        const [res] = await this.db.db<ReviewModel>('reviews').insert(createData).returning('*');
        return res;
    }

    async delete(uuid: string): Promise<void> {
        await this.db.db<ReviewModel>('reviews').delete().where({ uuid });
    }

    async getReviewsByQueryCriteria({
        limit,
        offset,
        criteria,
        includeIsLikeUserId,
    }: IGetReviewsByCriteria): Promise<IGetReviewsByCriteriaReturn> {
        const { orderBy, user_id, product_id, variant_id } = criteria;

        const buildUserQuery = () => {
            return this.db.db.raw(
                `select * from users ${user_id ? `where uuid::text = '${this.db.db.raw('?', [user_id])}'` : ''}`,
            );
        };

        const buildQuery = () => {
            const query = this.db.db
                .with('current_user', buildUserQuery())
                .select([
                    ...(includeIsLikeUserId
                        ? [this.db.db.raw('lk.uuid is not NULL as liked_by_me')]
                        : [this.db.db.raw(`FALSE as liked_by_me`)]),
                    'reviews.*',
                    'u.name as name',
                    'u.photo_image as image',
                    this.db.db.raw(`
                  COALESCE((
                    SELECT json_agg(
                      json_build_object(
                        ${includeIsLikeUserId ? `'liked_by_me', lkc.uuid is not null,` : `'liked_by_me', FALSE,`}
                        'uuid', rc.uuid,
                        'user_id', rc.user_id,
                        'review_id', rc.review_id,
                        'content', rc.content,
                        'image', uc.photo_image,
                        'name', uc.name,
                        'likes_count', rc.likes_count,
                        'created_at', rc.created_at,
                        'updated_at', rc.updated_at
                      )
                      ORDER BY rc.created_at ASC
                    )
                    FROM review_comments rc
                    INNER JOIN users uc ON rc.user_id = uc.uuid
                    
                    ${
                        includeIsLikeUserId
                            ? `left join likes lkc on lkc.user_id::text = '${includeIsLikeUserId}' and lkc.target_id = rc.uuid and target_type = 'review-comment'`
                            : ''
                    }
                    WHERE rc.review_id = reviews.uuid
                  ), '[]') AS comments
                `),
                ])
                .from('reviews')
                .join('current_user as u', 'u.uuid', 'reviews.user_id');

            const groupByArr = ['reviews.uuid', 'u.photo_image', 'u.name'];

            if (includeIsLikeUserId) {
                query.leftJoin(
                    this.db.db.raw(
                        `likes lk on lk.user_id::text = ? and lk.target_id = reviews.uuid and target_type = 'review'`,
                        [includeIsLikeUserId],
                    ),
                );
                groupByArr.push('lk.uuid');
            }

            if (product_id) {
                query.where(this.db.db.raw(`reviews.product_id::text =  '${product_id}'`));
            }
            if (variant_id) {
                query.where(this.db.db.raw(`reviews.product_variant_id::text =  '${variant_id}'`));
            }
            query.groupBy(...groupByArr);

            if (orderBy) {
                const res = orderByMap.get(orderBy);
                const [columnName, order] = res ? res : ['reviews.created_at', 'asc'];

                query.orderBy(columnName, order);
            }
            return query;
        };

        const [reviews, count] = await Promise.all([
            await buildQuery().limit(limit).offset(offset),
            await this.db.db.from(buildQuery().as('subquery')).count<{ count: string }[]>('* as count'),
        ]);
        return { reviews, count: Number(count[0].count) };
    }

    /// Review comments

    async createReviewComment(query: ICreateReviewComment): Promise<ReviewCommentModel> {
        const [res] = await this.db.db<ReviewCommentModel>('review_comments').insert(query).returning('*');
        return res;
    }

    async getReviewCommentByUuid(uuid: string): Promise<ReviewCommentModel | null> {
        const res = await this.db.db<ReviewCommentModel>('review_comments').where({ uuid }).first();
        return res || null;
    }

    async deleteReviewComment(uuid: string): Promise<void> {
        await this.db.db<ReviewCommentModel>('review_comments').delete().where({ uuid });
    }
}
