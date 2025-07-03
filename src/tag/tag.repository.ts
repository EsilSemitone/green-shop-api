import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ITagRepository } from './interfaces/tag.repository.interface';
import { APP_TYPES } from '../types';
import { IDatabaseService } from '../core/database/database.service.interface';
import { TagsModel } from '../common/models';
import { IGetTagByUniqueCriteria } from './interfaces/get-tag-by-unique-criteria.interface';
import { ICreateTagData } from './interfaces/create-tag.interface';

@injectable()
export class tagRepository implements ITagRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async getAll(): Promise<TagsModel[]> {
        const res = await this.db.db<TagsModel>('tags');
        return res;
    }

    async getByUniqueCriteria(query: IGetTagByUniqueCriteria): Promise<TagsModel | null> {
        const res = await this.db.db<TagsModel>('tags').where(query).first();
        return res || null;
    }

    async create(data: ICreateTagData): Promise<TagsModel> {
        const res = await this.db.db<TagsModel>('tags').insert(data).returning('*');
        return res[0];
    }

    async delete(uuid: string): Promise<void> {
        await this.db.db<TagsModel>('tags').delete().where({ uuid });
    }
}
