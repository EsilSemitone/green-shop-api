import { UserModel } from '../../common/models';

export interface IGetAllUsers {
    orderBy: 'first_old' | 'first_new';
    limit: number;
    offset: number;
    search?: string;
    isAdmin?: boolean;
}

export interface IGetAllUsersReturn {
    users: UserModel[];
    total: number;
}
