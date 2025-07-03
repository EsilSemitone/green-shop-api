import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { UserModel } from '../common/models/user-model.interface';
import { GetUserByUniqueCriteria } from './interfaces/get-user-by-unique-criteria.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';
import { IGetAllUsers, IGetAllUsersReturn } from './interfaces/get-all-users.interface';
import { ROLES, STATS_RANGE } from 'contracts-green-shop';
import { UsersOrderByMap } from './constants/users-order-by.map';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IGetStatsUsersData } from './interfaces/get-stats-users.interface';
import { IUsersStatsItem } from './interfaces/users-stats-item.interface';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {}

    async getByUniqueCriteria(data: GetUserByUniqueCriteria): Promise<UserModel | null> {
        const res = await this.databaseService.db<UserModel>('users').where(data).first();
        return res || null;
    }

    async create(data: ICreateUser): Promise<UserModel> {
        const [user] = await this.databaseService
            .db<UserModel>('users')
            .insert({
                ...data,
            })
            .returning('*');

        return user;
    }

    async update(uuid: string, data: IUpdateUser): Promise<UserModel> {
        const [user] = await this.databaseService
            .db<UserModel>('users')
            .update({ ...data, updated_at: new Date() })
            .where({ uuid })
            .returning('*');
        return user;
    }

    async delete(userId: string): Promise<void> {
        await this.databaseService.db<UserModel>('users').delete().where({ uuid: userId });
    }

    async getAll(data: IGetAllUsers): Promise<IGetAllUsersReturn> {
        const { orderBy, limit, offset, search, isAdmin } = data;

        const buildQuery = () => {
            const query = this.databaseService.db<UserModel>('users');
            if (isAdmin) {
                query.where({ role: ROLES.ADMIN });
            }

            if (search) {
                query.where((builder) => {
                    builder.whereLike('name', `%${search}%`);
                    builder.orWhereLike('email', `%${search}%`);
                    builder.orWhereLike('phone_number', `%${search}%`);
                });
            }

            const orderByParam = UsersOrderByMap.get(orderBy);

            if (!orderByParam) {
                throw new Error();
            }

            query.orderBy('created_at', orderByParam);

            return query;
        };

        const [users, count] = await Promise.all([
            await buildQuery().limit(limit).offset(offset),
            await this.databaseService.db.from(buildQuery()).count<{ count: string }[]>('* as count'),
        ]);

        return { users, total: Number(count[0].count) };
    }

    async getStats(data: IGetStatsUsersData): Promise<IUsersStatsItem[]> {
        const { range, startDay, endDay, raw } = data;

        const usersInDateRangeQuery = this.databaseService.db
            .select([
                'uuid',
                this.databaseService.db.raw(`CASE 
                    WHEN '${range}' = 'day' THEN TO_CHAR("created_at", 'YYYY-MM-DD')
                    WHEN '${range}' = 'week' THEN TO_CHAR(DATE_TRUNC('week', "created_at"), 'YYYY-MM-DD')
                    WHEN '${range}' = 'month' THEN TO_CHAR(DATE_TRUNC('month', "created_at"), 'YYYY-MM-DD')
                    ELSE TO_CHAR("created_at", 'DD-MM-YYYY')
                END AS date`),
            ])
            .from('users')
            .whereBetween('created_at', [startDay, endDay]);

        const buildDateRangeQuery = (startDay: string, endDay: string, range: STATS_RANGE) => {
            const queryFromMap = new Map([
                [
                    STATS_RANGE.DAY,
                    this.databaseService.db.raw(
                        `generate_series(
                        date '${startDay}',
                        date '${endDay}',
                        interval '1 ${range}'
                    )  AS date`,
                    ),
                ],
                [
                    STATS_RANGE.WEEK,
                    this.databaseService.db.raw(
                        `generate_series(
                        DATE_TRUNC('${range}', date '${startDay}'),
                        DATE_TRUNC('${range}', date '${endDay}'),
                        interval '1 ${range}'
                    )  AS date`,
                    ),
                ],
                [
                    STATS_RANGE.MONTH,
                    this.databaseService.db.raw(
                        `generate_series(
                        DATE_TRUNC('${range}', date '${startDay}'),
                        DATE_TRUNC('${range}', date '${endDay}'),
                        interval '1 ${range}'
                    )  AS date`,
                    ),
                ],
            ]);
            const query = this.databaseService.db
                .select([this.databaseService.db.raw(`TO_CHAR("date", 'YYYY-MM-DD') as date`)])
                .from(
                    queryFromMap.get(range) ||
                        this.databaseService.db.raw(
                            `generate_series(
                                date '${startDay}',
                                date '${endDay}',
                                interval '1 ${range}'
                            )  AS date`,
                        ),
                );

            return query;
        };

        const result: IUsersStatsItem[] = await this.databaseService.db
            .with('users_in_date_range', usersInDateRangeQuery)
            .with('date_range', buildDateRangeQuery(raw.startDay, raw.endDay, range))
            .select(
                this.databaseService.db.raw(`
                coalesce(t.total, 0) as count,
                date_range.date::date
              `),
            )
            .from('date_range')
            .leftJoin(
                this.databaseService.db
                    .select([this.databaseService.db.raw(' count(uuid) as total'), 'date'])
                    .from('users_in_date_range')
                    .groupBy('date')
                    .as('t'),
                'date_range.date',
                't.date',
            )
            .groupBy('t.date', 'date_range.date', 't.total')
            .orderBy('date_range.date');

        return result.map((s) => {
            return {
                count: Number(s.count),
                date: s.date,
            };
        });
    }
}
