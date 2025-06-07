import 'reflect-metadata';
import { injectable } from 'inversify';
import { Logger, pino } from 'pino';
import { LOGGER_CONFIG } from '../../common/config/logger.config.ts';
import { ILogger } from './logger.service.interface.ts';

@injectable()
export class LoggerService implements ILogger {
    private logger: Logger;
    serviceName?: string;

    constructor() {
        this.logger = pino(LOGGER_CONFIG);
    }

    public log(msg: string): void {
        this.logger.info(this.getMessage(msg));
    }
    public warn(msg: string): void {
        this.logger.warn(this.getMessage(msg));
    }
    public error(msg: string): void {
        this.logger.error(this.getMessage(msg));
    }

    private getMessage(msg: string): string {
        return this.serviceName ? `[${this.serviceName}] ${msg}` : msg;
    }

    public setServiceName(name: string) {
        this.serviceName = name;
    }
}
