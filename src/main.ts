import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { APP_TYPES } from './types';
import { App } from './app';
import { IConfigService } from './core/configService/config.service.interface';
import { IMainReturnType } from './common/interfaces/main-return.interface';
import { ConfigService } from './core/configService/config.service';
import { LoggerService } from './core/logger/logger.service';
import { ILogger } from './core/logger/logger.service.interface';
import { IController } from './common/interfaces/controller.interface';
import { AuthController } from './auth/auth.controller';
import { IExceptionsFilter } from './common/exceptionFilter/exceptionFilter.interface';
import { ExceptionsFilter } from './common/exceptionFilter/exceptionFilter';
import { AuthService } from './auth/auth.service';
import { IAuthService } from './auth/interfaces/auth.service.interface';
import { IDatabaseService } from './core/database/database.service.interface';
import { DatabaseService } from './core/database/database.service';
import { IUserRepository } from './user/interfaces/user.repository.interface';
import { UserRepository } from './user/user.repository';
import { IJwtService } from './core/jwtService/jwt.service.interface';
import { JwtService } from './core/jwtService/jwt.service';
import { IEmailService } from './integration/email/email.service.interface';
import { EmailService } from './integration/email/email.service';
import { IRefreshTokenRepository } from './refresh-token/interfaces/refresh-token.repository.interface';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';
import { AuthGuardFactory } from './common/middlewares/auth.guard.factory';

const container = new Container();

const appModule = new ContainerModule(({ bind }) => {
    bind<IConfigService>(APP_TYPES.CONFIG_SERVICE).to(ConfigService).inSingletonScope();
    bind<ILogger>(APP_TYPES.LOGGER_SERVICE).to(LoggerService);
    bind<IExceptionsFilter>(APP_TYPES.EXCEPTION_FILTER).to(ExceptionsFilter).inSingletonScope();
    bind<IDatabaseService>(APP_TYPES.DATABASE_SERVICE).to(DatabaseService).inSingletonScope();
    bind<IJwtService>(APP_TYPES.JWT_SERVICE).to(JwtService).inSingletonScope();
    bind<AuthGuardFactory>(APP_TYPES.AUTH_GUARD_FACTORY).to(AuthGuardFactory).inSingletonScope();

    bind<IEmailService>(APP_TYPES.EMAIL_SERVICE).to(EmailService).inSingletonScope();
    bind<IRefreshTokenRepository>(APP_TYPES.REFRESH_TOKEN_REPOSITORY).to(RefreshTokenRepository).inSingletonScope();
});

const authModule = new ContainerModule(({ bind }) => {
    bind<IController>(APP_TYPES.AUTH_CONTROLLER).to(AuthController).inSingletonScope();
    bind<IAuthService>(APP_TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope();
});

const userModule = new ContainerModule(({ bind }) => {
    bind<IUserRepository>(APP_TYPES.USER_REPOSITORY).to(UserRepository).inSingletonScope();
});

function buildContainer(): Container {
    container.load(appModule);
    container.load(userModule);
    container.load(authModule);
    container.bind<App>(APP_TYPES.APP).to(App).inSingletonScope();

    return container;
}

async function main(): Promise<IMainReturnType> {
    const container = buildContainer();
    const app = container.get<App>(APP_TYPES.APP);
    app.init();

    return { app, container };
}

export const startApp = main();
