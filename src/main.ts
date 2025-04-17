import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { APP_TYPES } from './types';
import { App } from './app';
import { IConfigService } from './configService/config.service.interface';
import { IMainReturnType } from './common/interfaces/main-return.interface';
import { ConfigService } from './configService/config.service';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.service.interface';

const container = new Container();

const appModule = new ContainerModule(({ bind }) => {
    bind<IConfigService>(APP_TYPES.CONFIG_SERVICE).to(ConfigService).inSingletonScope();
    bind<ILogger>(APP_TYPES.LOGGER_SERVICE).to(LoggerService);
});

function buildContainer(): Container {
    container.load(appModule);
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
