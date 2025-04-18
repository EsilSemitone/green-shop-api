import "reflect-metadata"
import { inject, injectable } from "inversify";
import { APP_TYPES } from "../types";
import { IDatabaseService } from "../database/database.service.interface";
import { UserModel } from "../common/models/user-models.interface";
import { GetUserByUniqueCriteria } from "./interfaces/get-user-by-unique-criteria.interface";

@injectable()
export class UserRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private databaseService: IDatabaseService) {

    }

    async getByUniqueCriteria({email}: GetUserByUniqueCriteria): Promise<UserModel | undefined> {
        return this.databaseService.db<UserModel>("users").where({email}).first()
    }
}