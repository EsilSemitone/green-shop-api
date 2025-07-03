import { Container } from 'inversify';
import { IConfigService } from '../core/configService/config.service.interface.ts';
import { ILogger } from '../core/logger/logger.service.interface';
import { IUserRepository } from './interfaces/user.repository.interface.ts';
import { IUserService } from './interfaces/user.service.interface.ts';
import { UserService } from './user.service';
import { UserModel } from '../common/models';
import { randomUUID } from 'crypto';
import { ROLES, UpdateUserRequestDto } from 'contracts-green-shop';
import { compareSync, hashSync } from 'bcryptjs';
import { APP_TYPES } from '../types';

const USER: UserModel = {
    uuid: randomUUID(),
    name: 'ivan',
    email: 'ivan@mail.ru',
    role: ROLES.USER,
    password_hash: hashSync('password'),
    restore_code: null,
    phone_number: null,
    photo_image: null,
    created_at: new Date(),
    updated_at: new Date(),
};

const loggerServiceMock: ILogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setServiceName: jest.fn(),
};

const userRepositoryMock: jest.Mocked<IUserRepository> = {
    getByUniqueCriteria: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getStats: jest.fn(),
};
const configServiceMock: jest.Mocked<IConfigService> = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
};

let userService: IUserService;

beforeAll(() => {
    const container = new Container();
    container.bind<IUserService>(APP_TYPES.USER_SERVICE).to(UserService);
    container.bind<ILogger>(APP_TYPES.LOGGER_SERVICE).toConstantValue(loggerServiceMock);
    container.bind<IUserRepository>(APP_TYPES.USER_REPOSITORY).toConstantValue(userRepositoryMock);
    container.bind<IConfigService>(APP_TYPES.CONFIG_SERVICE).toConstantValue(configServiceMock);

    userService = container.get(APP_TYPES.USER_SERVICE);
});

describe('User service', () => {
    describe('me', () => {
        it('should return current user', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValue(USER);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, restore_code, ...currentFields } = USER;
            const res = await userService.me(USER.uuid);
            expect(res).toEqual(currentFields);
        });

        it('should throw error', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            await expect(userService.me(USER.uuid)).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should update user with current fields', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValue(USER);
            userRepositoryMock.update.mockResolvedValue(USER);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, restore_code, ...currentFields } = USER;
            const updateData: UpdateUserRequestDto = {
                name: 'super_ivan',
                password: '123123123123',
                email: 'superivan@mail.ru',
            };

            const res = await userService.update(USER.uuid, updateData);
            expect(res).toMatchObject(currentFields);
        });

        it('should hash password', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValue(USER);
            const SALT = '8';
            configServiceMock.getOrThrow.mockReturnValue(SALT);

            const updateData: UpdateUserRequestDto = {
                password: '123123123123',
            };

            await userService.update(USER.uuid, updateData);
            expect(userRepositoryMock.update.mock.calls[0][1].password_hash).toBeDefined();
            expect(userRepositoryMock.update.mock.calls[0][1].password_hash).not.toBe(updateData.password);
            expect(
                compareSync(updateData.password!, String(userRepositoryMock.update.mock.calls[0][1].password_hash)),
            ).toBeTruthy();
        });

        it('should return old data', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValue(USER);
            userRepositoryMock.update.mockResolvedValue(USER);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, restore_code, ...currentFields } = USER;

            const res = await userService.update(USER.uuid, {});
            expect(res).toEqual(currentFields);
        });

        it('should throw error', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            await expect(userService.update(USER.uuid, {})).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete user', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValue(USER);

            await userService.delete(USER.uuid);
            expect(userRepositoryMock.delete).toHaveBeenCalledWith(USER.uuid);
        });

        it('should return success', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValue(USER);

            const result = await userService.delete(USER.uuid);
            expect(result).toEqual({ isSuccess: true });
        });

        it('should throw error', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            await expect(userService.delete(USER.uuid)).rejects.toThrow();
        });
    });
});
