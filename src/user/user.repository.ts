import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { UserModel } from '../common/models/user-model.interface';
import { GetUserByUniqueCriteria } from './interfaces/get-user-by-unique-criteria.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';

@injectable()
export class UserRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {}

    async getByUniqueCriteria(data: GetUserByUniqueCriteria): Promise<UserModel | undefined> {
        return this.databaseService.db<UserModel>('users').where(data).first();
    }

    async create(data: ICreateUser): Promise<UserModel> {
        await this.databaseService.db<UserModel>('users').insert({
            ...data,
        });

        const user = await this.databaseService.db<UserModel>('users').where({ email: data.email }).first();
        return user as UserModel;
    }

    async update(uuid: string, data: IUpdateUser): Promise<UserModel> {
        await this.databaseService
            .db<UserModel>('users')
            .update({ ...data })
            .where({ uuid });

        const user = await this.databaseService.db<UserModel>('users').where({ uuid }).first();
        return user as UserModel;
    }
}
