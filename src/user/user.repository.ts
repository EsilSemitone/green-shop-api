import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types.ts';
import { IDatabaseService } from '../core/database/database.service.interface.ts';
import { UserModel } from '../common/models/user-model.interface.ts';
import { GetUserByUniqueCriteria } from './interfaces/get-user-by-unique-criteria.interface.ts';
import { ICreateUser } from './interfaces/create-user.interface.ts';
import { IUpdateUser } from './interfaces/update-user.interface.ts';

@injectable()
export class UserRepository {
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
            .update({ ...data })
            .where({ uuid })
            .returning('*');
        return user;
    }

    async delete(userId: string): Promise<void> {
        await this.databaseService.db<UserModel>('users').delete().where({ uuid: userId });
    }
}
