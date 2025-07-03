import { TagsModel } from '../../common/models';
import { ICreateTagData } from './create-tag.interface';
import { IGetTagByUniqueCriteria } from './get-tag-by-unique-criteria.interface';

export interface ITagRepository {
    getAll(): Promise<TagsModel[]>;
    getByUniqueCriteria(query: IGetTagByUniqueCriteria): Promise<TagsModel | null>;
    create(data: ICreateTagData): Promise<TagsModel>;
    delete(uuid: string): Promise<void>;
}
