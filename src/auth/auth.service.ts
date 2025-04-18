import "reflect-metadata"
import { inject, injectable } from "inversify";
import { IAuthService } from "./interfaces/auth.service.interface";
import { APP_TYPES } from "../types";
import { ILogger } from "../logger/logger.service.interface";
import { RegisterSchemaRequestDto, RegisterSchemaResponseDto } from "contracts";
import { IUserRepository } from "../user/interfaces/user.repository.interface";
import { HttpException } from "../common/exceptionFilter/http.exception";

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.USER_REPOSITORY) private userRepository: IUserRepository,
    ) {
        this.loggerService.setServiceName(AuthService.name)
    }

    async register({name, email, password}: RegisterSchemaRequestDto): Promise<RegisterSchemaResponseDto> {
        this.loggerService.log(`Start service register user with params: ${JSON.stringify({name, email})}`)

        const isUserExist = await this.userRepository.getByUniqueCriteria({email})

        if (!isUserExist) {
            throw new HttpException()
        }
    }
}