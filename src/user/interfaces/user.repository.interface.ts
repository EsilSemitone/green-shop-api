import { UserModel } from "../../common/models/user-models.interface";
import { GetUserByUniqueCriteria } from "./get-user-by-unique-criteria.interface";

export interface IUserRepository {
    getByUniqueCriteria(data: GetUserByUniqueCriteria): Promise<UserModel | undefined> 
}