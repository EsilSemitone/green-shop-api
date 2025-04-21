import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IAuthService } from './interfaces/auth.service.interface';
import { APP_TYPES } from '../types';
import { ILogger } from '../core/logger/logger.service.interface';
import {
    LoginSchemaRequestDto,
    LoginSchemaResponseDto,
    LogoutRequestDto,
    LogoutResponseDto,
    RegisterSchemaRequestDto,
    RegisterSchemaResponseDto,
    ResetPasswordRequestDto,
    ResetPasswordResponseDto,
    RestorePasswordResponseDto,
    ROLES,
} from 'contracts';
import { IUserRepository } from '../user/interfaces/user.repository.interface';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';
import { UserEntity } from '../user/user.entity';
import { IConfigService } from '../core/configService/config.service.interface';
import { IJwtService } from '../core/jwtService/jwt.service.interface';
import { randomBytes } from 'crypto';
import { IEmailService } from '../integration/email/email.service.interface';
import { IRefreshTokenRepository } from '../refresh-token/interfaces/refresh-token.repository.interface';
import { IJwtPayload } from '../core/jwtService/interfaces/jwt.payload';

@injectable()
export class AuthService implements IAuthService {
    salt: number;

    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.USER_REPOSITORY) private userRepository: IUserRepository,
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
        @inject(APP_TYPES.JWT_SERVICE) private jwtService: IJwtService,
        @inject(APP_TYPES.EMAIL_SERVICE) private emailService: IEmailService,
        @inject(APP_TYPES.REFRESH_TOKEN_REPOSITORY) private refreshTokenRepository: IRefreshTokenRepository,
    ) {
        this.loggerService.setServiceName(AuthService.name);
        this.salt = Number.parseInt(this.configService.getOrThrow('SALT'));
    }

    async register({ name, email, password }: RegisterSchemaRequestDto): Promise<RegisterSchemaResponseDto> {
        this.loggerService.log(`Start service register user with params: ${JSON.stringify({ name, email })}`);

        const isUserExist = await this.userRepository.getByUniqueCriteria({ email });

        if (isUserExist) {
            throw new HttpException(ERROR.USER_ALREADY_EXIST, 400);
        }

        const password_hash = UserEntity.hashPassword(password, this.salt);
        const user = await this.userRepository.create({ name, email, password_hash });

        const [accessToken, refreshToken] = await Promise.all([
            await this.jwtService.signAccess(user.uuid, ROLES.USER),
            await this.jwtService.signRefresh(user.uuid, ROLES.USER),
        ]);

        await this.refreshTokenRepository.create({
            userId: user.uuid,
            token: refreshToken,
            expires_at: new Date(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30),
        });

        this.loggerService.log(`Success service register user`);
        return {
            accessToken,
            refreshToken,
        };
    }

    async login({ email, password }: LoginSchemaRequestDto): Promise<LoginSchemaResponseDto> {
        this.loggerService.log(
            `Start service login user with params: ${JSON.stringify({ email, password: 'unknown' })}`,
        );

        const isUserExist = await this.userRepository.getByUniqueCriteria({ email });

        if (!isUserExist) {
            throw new HttpException(ERROR.INVALID_LOGIN_DATA, 400);
        }

        const isValidPassword = UserEntity.validatePassword(password, isUserExist.password_hash);

        if (!isValidPassword) {
            throw new HttpException(ERROR.INVALID_LOGIN_DATA, 400);
        }

        const [accessToken, refreshToken] = await Promise.all([
            await this.jwtService.signAccess(isUserExist.uuid, isUserExist.role),
            await this.jwtService.signRefresh(isUserExist.uuid, isUserExist.role),
        ]);

        await this.refreshTokenRepository.create({
            userId: isUserExist.uuid,
            token: refreshToken,
            expires_at: new Date(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30),
        });

        this.loggerService.log(`Success service login user`);
        return {
            accessToken,
            refreshToken,
        };
    }

    async restorePassword(email: string): Promise<RestorePasswordResponseDto> {
        this.loggerService.log(`Start service restorePassword user with params: ${JSON.stringify({ email })}`);

        const isUserExist = await this.userRepository.getByUniqueCriteria({ email });

        if (!isUserExist) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 400);
        }

        const restoreCode = randomBytes(40).toString('hex');

        await this.userRepository.update(isUserExist.uuid, { restore_code: restoreCode });

        console.log('here');
        await this.emailService.sendRestoreCodeEmail(email, restoreCode);

        this.loggerService.log(`Success service restorePassword`);
        return {
            isSuccess: true,
        };
    }

    async resetPassword({ password, restore_code }: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
        this.loggerService.log(`Start service resetPassword user with params: ${JSON.stringify({ restore_code })}`);

        const user = await this.userRepository.getByUniqueCriteria({ restore_code });

        if (!user) {
            throw new HttpException(ERROR.USER_NOT_FOUND, 404);
        }

        const hashPassword = UserEntity.hashPassword(password, this.salt);
        await this.userRepository.update(user.uuid, { password_hash: hashPassword });

        this.loggerService.log(`Success service resetPassword`);
        return {
            isSuccess: true,
        };
    }

    async logout({ refreshToken }: LogoutRequestDto, { userId }: IJwtPayload): Promise<LogoutResponseDto> {
        this.loggerService.log(`Start service logout user with params: ${JSON.stringify({ refreshToken })}`);

        await this.refreshTokenRepository.tokenDisable(userId, refreshToken);

        this.loggerService.log(`Success service logout user`);

        return {
            isSuccess: true,
        };
    }
}
