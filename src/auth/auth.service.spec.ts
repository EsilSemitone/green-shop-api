import { Container } from 'inversify';
import { IAuthService } from './interfaces/auth.service.interface';
import { ILogger } from '../core/logger/logger.service.interface';
import { IUserRepository } from '../user/interfaces/user.repository.interface';
import { IConfigService } from '../core/configService/config.service.interface';
import { Config } from '../core/configService/interfaces/config.service.schema';
import { IEmailService } from '../integration/email/email.service.interface';
import { IRefreshTokenRepository } from '../refresh-token/interfaces/refresh-token.repository.interface';
import { APP_TYPES } from '../types';
import { AuthService } from './auth.service';
import { IJwtService } from '../core/jwtService/jwt.service.interface';
import { UserModel } from '../common/models';
import { ROLES } from 'contracts-green-shop';
import { ERROR } from '../common/error/error';
import { hashSync } from 'bcryptjs';

let authService: IAuthService;

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

const configServiceMock: IConfigService = {
    get: jest.fn(),
    getOrThrow: function (key: keyof Config): string {
        const store = new Map<keyof Config, string>([
            ['SALT', '5'],
            ['SECRET', 'secret'],
            ['CLIENT_URL', 'client_url'],
            ['MAILOPOST_API_KEY', 'api_key'],
        ]);

        const result = store.get(key);

        if (!result) {
            throw new Error('error');
        }

        return result;
    },
};

const emailServiceMock: jest.Mocked<IEmailService> = {
    sendRestoreCodeEmail: jest.fn(),
    domain: 'domain',
    api_key: 'api_key',
    senderName: 'senderName',
    senderEmail: 'senderEmail',
};

const refreshTokenRepositoryMock: jest.Mocked<IRefreshTokenRepository> = {
    create: jest.fn(),
    tokenDisable: jest.fn(),
    getById: jest.fn(),
    deleteById: jest.fn(),
    getByUniqueCriteria: jest.fn(),
};

const jwtServiceMock: jest.Mocked<IJwtService> = {
    signAccess: jest.fn(),
    signRefresh: jest.fn(),
    verify: jest.fn(),
};

beforeAll(() => {
    const container = new Container();
    container.bind<ILogger>(APP_TYPES.LOGGER_SERVICE).toConstantValue(loggerServiceMock);
    container.bind<IUserRepository>(APP_TYPES.USER_REPOSITORY).toConstantValue(userRepositoryMock);
    container.bind<IConfigService>(APP_TYPES.CONFIG_SERVICE).toConstantValue(configServiceMock);
    container.bind<IEmailService>(APP_TYPES.EMAIL_SERVICE).toConstantValue(emailServiceMock);
    container
        .bind<IRefreshTokenRepository>(APP_TYPES.REFRESH_TOKEN_REPOSITORY)
        .toConstantValue(refreshTokenRepositoryMock);
    container.bind<IJwtService>(APP_TYPES.JWT_SERVICE).toConstantValue(jwtServiceMock);
    container.bind<IAuthService>(APP_TYPES.AUTH_SERVICE).to(AuthService);

    authService = container.get(APP_TYPES.AUTH_SERVICE);
});

describe('Auth service', () => {
    const USER: UserModel = {
        uuid: '1',
        name: 'user',
        email: 'user@mail.ru',
        role: ROLES.USER,
        password_hash: hashSync('12345678'),
        restore_code: null,
        phone_number: null,
        photo_image: null,
        created_at: new Date(),
        updated_at: new Date(),
    };

    describe('register', () => {
        const registerQuery = {
            name: USER.name,
            email: USER.email,
            password: '12345678',
        };

        it('should create user and return tokens', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);
            userRepositoryMock.create.mockResolvedValueOnce(USER);

            jwtServiceMock.signAccess.mockResolvedValueOnce('access-token');
            jwtServiceMock.signRefresh.mockResolvedValueOnce('refresh-token');

            const result = await authService.register(registerQuery);

            expect(result).toEqual(
                expect.objectContaining({
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token',
                }),
            );

            expect(userRepositoryMock.getByUniqueCriteria).toHaveBeenCalledWith({ email: USER.email });
            expect(userRepositoryMock.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: registerQuery.name,
                    email: registerQuery.email,
                    password_hash: expect.any(String),
                }),
            );
            expect(jwtServiceMock.signAccess).toHaveBeenCalledWith(USER.uuid, ROLES.USER);
            expect(jwtServiceMock.signRefresh).toHaveBeenCalledWith(USER.uuid, ROLES.USER);
            expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_id: USER.uuid,
                    token: 'refresh-token',
                    expires_at: expect.any(Date),
                }),
            );
        });

        it('should throw error (user already exist)', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(USER);
            await expect(authService.register(registerQuery)).rejects.toThrow(ERROR.USER_ALREADY_EXIST);
        });
    });

    describe('login', () => {
        it('should throw error (user already exist)', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            await expect(authService.login({ email: USER.email, password: '12345678' })).rejects.toThrow(
                ERROR.INVALID_LOGIN_DATA,
            );
        });

        it('should throw error (invalid password)', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(USER);

            await expect(authService.login({ email: USER.email, password: '1234567' })).rejects.toThrow(
                ERROR.INVALID_LOGIN_DATA,
            );
        });

        it('should login and return tokens', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(USER);
            jwtServiceMock.signAccess.mockResolvedValueOnce('access-token');
            jwtServiceMock.signRefresh.mockResolvedValueOnce('refresh-token');

            const result = await authService.login({ email: USER.email, password: '12345678' });

            expect(jwtServiceMock.signAccess).toHaveBeenCalledWith(USER.uuid, USER.role);
            expect(jwtServiceMock.signRefresh).toHaveBeenCalledWith(USER.uuid, USER.role);
            expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    user_id: USER.uuid,
                    token: 'refresh-token',
                    expires_at: expect.any(Date),
                }),
            );
            expect(result).toEqual({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });
        });
    });

    describe('restorePassword', () => {
        it('should throw error (user not found)', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);
            await expect(authService.restorePassword(USER.email)).rejects.toThrow(ERROR.USER_NOT_FOUND);
        });

        it('should send restore code, update user and return success', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(USER);

            const result = await authService.restorePassword(USER.email);

            expect(result).toEqual({ isSuccess: true });
            expect(userRepositoryMock.update).toHaveBeenCalledWith(
                USER.uuid,
                expect.objectContaining({ restore_code: expect.any(String) }),
            );
            expect(emailServiceMock.sendRestoreCodeEmail).toHaveBeenCalledWith(USER.email, expect.any(String));
        });
    });

    describe('resetPassword', () => {
        const inputData = { password: '12345678', restore_code: '239845091238745019' };
        it('should throw error (user not found)', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            await expect(authService.resetPassword(inputData)).rejects.toThrow(ERROR.USER_NOT_FOUND);
        });

        it('should reset password , update user and return success', async () => {
            userRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(USER);

            const result = await authService.resetPassword(inputData);

            expect(result).toEqual({ isSuccess: true });
            expect(userRepositoryMock.update).toHaveBeenCalledWith(
                USER.uuid,
                expect.objectContaining({ password_hash: expect.any(String) }),
            );
        });
    });

    describe('logout', () => {
        const token = '12345678';
        it('should return => success: false (token is not transferred)', async () => {
            const result = await authService.logout(undefined, { userId: USER.uuid, role: USER.role });
            expect(result).toEqual({ isSuccess: false });
        });

        it('should return => success: false (token is not transferred)', async () => {
            refreshTokenRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            const result = await authService.logout(token, { userId: USER.uuid, role: USER.role });
            expect(result).toEqual({ isSuccess: false });
        });

        it('should success disable token and return => success: true', async () => {
            refreshTokenRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce({
                uuid: '1',
                user_id: '2',
                token: token,
                expires_at: new Date(),
                is_valid: true,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const result = await authService.logout(token, { userId: USER.uuid, role: USER.role });

            expect(refreshTokenRepositoryMock.getByUniqueCriteria).toHaveBeenCalledWith({ token });
            expect(refreshTokenRepositoryMock.tokenDisable).toHaveBeenCalledWith(USER.uuid, token);

            expect(result).toEqual({ isSuccess: true });
        });
    });

    describe('refresh', () => {
        const refreshTokenModel = {
            uuid: '1',
            user_id: '2',
            token: '12345678',
            expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
            is_valid: true,
            created_at: new Date(),
            updated_at: new Date(),
        };
        const refresh_token = '12345678';
        it('should throw error (refreshToken is not defined)', async () => {
            await expect(authService.refresh(undefined)).rejects.toThrow(ERROR.INVALID_REFRESH_TOKEN);
        });

        it('should throw error (refreshToken is not found)', async () => {
            refreshTokenRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);
            await expect(authService.refresh(refresh_token)).rejects.toThrow(ERROR.INVALID_REFRESH_TOKEN);
        });

        it('should throw error (refreshToken is not valid) [invalid status]', async () => {
            refreshTokenRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce({
                ...refreshTokenModel,
                is_valid: false,
            });

            await expect(authService.refresh(refreshTokenModel.token)).rejects.toThrow(ERROR.INVALID_REFRESH_TOKEN);
        });

        it('should throw error (refreshToken is not valid) [invalid status]', async () => {
            refreshTokenRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce({
                ...refreshTokenModel,
                expires_at: new Date(new Date().getTime() - 1000 * 60), //просрочен на минуту
            });

            await expect(authService.refresh(refreshTokenModel.token)).rejects.toThrow(ERROR.INVALID_REFRESH_TOKEN);
        });
    });
});
