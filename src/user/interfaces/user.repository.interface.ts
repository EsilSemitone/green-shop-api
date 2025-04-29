import { UserModel } from '../../common/models/user-model.interface';
import { ICreateUser } from './create-user.interface';
import { GetUserByUniqueCriteria } from './get-user-by-unique-criteria.interface';
import { IUpdateUser } from './update-user.interface';

export interface IUserRepository {
    getByUniqueCriteria(data: GetUserByUniqueCriteria): Promise<UserModel | undefined>;
    create(data: ICreateUser): Promise<UserModel>;
    update(uuid: string, data: IUpdateUser): Promise<UserModel>;
    delete(userId: string): Promise<void>;
}
