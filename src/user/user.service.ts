import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ILogger } from '../core/logger/logger.service.interface';
import { APP_TYPES } from '../types';
import { IUserRepository } from './interfaces/user.repository.interface';
import { DeleteUserResponseDto, GetMeResponseDto, UpdateUserRequestDto, UpdateUserResponseDto } from 'contracts';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';
import { IUserService } from './interfaces/user.service.interface';
import { UserEntity } from './user.entity';
import { IConfigService } from '../core/configService/config.service.interface';

@injectable()
export class UserService implements IUserService {
    salt: number;
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.USER_REPOSITORY) private userRepository: IUserRepository,
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
    ) {
        this.loggerService.setServiceName(UserService.name);
        this.salt = Number(this.configService.getOrThrow('SALT'));
    }

    async me(userId: string): Promise<GetMeResponseDto> {
        this.loggerService.log(`Start service users - get me with params: ${JSON.stringify({ userId })}`);

        const userData = await this.userRepository.getByUniqueCriteria({ uuid: userId });
        if (!userData) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 404);
        }

        const { password_hash, restore_code, ...result } = userData;

        this.loggerService.log('Success service users - get me');
        return result;
    }

    async update(
        userId: string,
        { password, ...otherUpdateData }: UpdateUserRequestDto,
    ): Promise<UpdateUserResponseDto> {
        this.loggerService.log(
            `Start service update user with params: ${JSON.stringify({ userId, password, ...otherUpdateData })}`,
        );

        const user = await this.userRepository.getByUniqueCriteria({ uuid: userId });
        if (!user) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 404);
        }

        const updatedData = {
            ...otherUpdateData,
            ...(password ? { password_hash: UserEntity.hashPassword(password, this.salt) } : []),
        };

        if (Object.keys(updatedData).length === 0) {
            const { password_hash, restore_code, ...result } = user;

            this.loggerService.log('Success service update user ');
            return result;
        }

        const updatedUser = await this.userRepository.update(userId, updatedData);
        const { password_hash, restore_code, ...result } = updatedUser;

        this.loggerService.log('Success service update user ');
        return result;
    }

    async delete(userId: string): Promise<DeleteUserResponseDto> {
        this.loggerService.log(`Start service delete user with params: ${JSON.stringify({ userId })}`);

        const user = await this.userRepository.getByUniqueCriteria({ uuid: userId });
        if (!user) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 404);
        }

        await this.userRepository.delete(userId);

        this.loggerService.log('Success service delete user');
        return { isSuccess: true };
    }
}
