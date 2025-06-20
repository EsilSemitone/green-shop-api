import { UserModel } from '../../common/models/user-model.interface.ts';
import { ICreateUser } from './create-user.interface.ts';
import { GetUserByUniqueCriteria } from './get-user-by-unique-criteria.interface.ts';
import { IUpdateUser } from './update-user.interface.ts';

export interface IUserRepository {
    getByUniqueCriteria(data: GetUserByUniqueCriteria): Promise<UserModel | null>;
    create(data: ICreateUser): Promise<UserModel>;
    update(uuid: string, data: IUpdateUser): Promise<UserModel>;
    delete(userId: string): Promise<void>;
}
