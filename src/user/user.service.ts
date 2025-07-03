import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ILogger } from '../core/logger/logger.service.interface';
import { APP_TYPES } from '../types';
import { IUserRepository } from './interfaces/user.repository.interface';
import {
    AddAdminUserResponseDto,
    DeleteUserResponseDto,
    GetAllUsersRequestQueryDto,
    GetAllUsersResponseDto,
    GetMeResponseDto,
    GetStatsUsersRequestParamsDto,
    GetStatsUsersResponseDto,
    GetUserResponseDto,
    ROLES,
    UpdateUserRequestDto,
    UpdateUserResponseDto,
} from 'contracts-green-shop';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';
import { IUserService } from './interfaces/user.service.interface';
import { UserEntity } from './user.entity';
import { IConfigService } from '../core/configService/config.service.interface';
import { upgradeEndDate, upgradeStartDate } from '../common/utils/upgrade-date';

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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, restore_code, ...result } = user;

            this.loggerService.log('Success service update user ');
            return result;
        }

        const updatedUser = await this.userRepository.update(userId, updatedData);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    async getAll(dto: GetAllUsersRequestQueryDto): Promise<GetAllUsersResponseDto> {
        this.loggerService.log(`Start service getAll users with params ${JSON.stringify(dto)}`);

        const { limit, offset } = dto;
        const { users, total } = await this.userRepository.getAll(dto);

        const totalPage = Math.ceil(total / limit);
        const page = Math.floor(offset / limit) + (total > 0 ? 1 : 0);

        const usersWithCurrentFields = users.map(({ uuid, name, email, photo_image }) => {
            return {
                uuid,
                name,
                email,
                photo_image,
            };
        });

        this.loggerService.log('Success service getAll users');

        return {
            totalPage,
            page,
            users: usersWithCurrentFields,
        };
    }

    async getUser(userId: string): Promise<GetUserResponseDto> {
        this.loggerService.log(`Start service getUser with params ${JSON.stringify({ userId })}`);

        const user = await this.userRepository.getByUniqueCriteria({ uuid: userId });

        if (!user) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 404);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, restore_code, ...userWithCurrentFields } = user;

        this.loggerService.log('Success service getUser');
        return userWithCurrentFields;
    }

    async addAdminUser(email: string): Promise<AddAdminUserResponseDto> {
        this.loggerService.log(`Start service addAdminUser with params ${JSON.stringify({ email })}`);

        const user = await this.userRepository.getByUniqueCriteria({ email });

        if (!user) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 404);
        }

        await this.userRepository.update(user.uuid, { role: ROLES.ADMIN });

        this.loggerService.log('Success service add addAdminUser');

        return {
            isSuccess: true,
        };
    }

    async getStats(dto: GetStatsUsersRequestParamsDto): Promise<GetStatsUsersResponseDto> {
        this.loggerService.log(`Start service getStats with params ${JSON.stringify(dto)}`);

        const stats = await this.userRepository.getStats({
            ...dto,
            startDay: upgradeStartDate(dto.startDay),
            endDay: upgradeEndDate(dto.endDay),
            raw: {
                startDay: dto.startDay,
                endDay: dto.endDay,
            },
        });

        const total = stats.reduce((prev, s) => {
            return prev + s.count;
        }, 0);

        this.loggerService.log('Success service getStats');
        return {
            stats,
            total,
        };
    }
}
