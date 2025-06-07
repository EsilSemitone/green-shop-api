import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../../types.ts';
import { ILogger } from '../../core/logger/logger.service.interface.ts';
import axios, { AxiosError } from 'axios';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { API_URL } from './constants/api.ts';
import { IEmailService } from './email.service.interface.ts';
import { IConfigService } from '../../core/configService/config.service.interface.ts';

@injectable()
export class EmailService implements IEmailService {
    domain: string;
    api_key: string;

    senderName: string = 'green-shop';
    senderEmail: string = 'tarisfales@gmail.com';

    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
    ) {
        const domain = this.configService.getOrThrow('CLIENT_URL');
        this.api_key = this.configService.getOrThrow('MAILOPOST_API_KEY');
        this.domain = domain;
    }

    async sendRestoreCodeEmail(email: string, restoreCode: string): Promise<void> {
        this.loggerService.log(
            `Start service sendRestoreCodeEmail with params: ${JSON.stringify({ email, restoreCode })}`,
        );

        try {
            const templateSource = readFileSync(`${__dirname}/email/restore-code.hbs`, 'utf8');
            const template = compile(templateSource);

            const htmlBody = template({
                link: `${this.domain}/restore?code=${restoreCode}`,
            });

            const link = `${API_URL}/email/messages`;

            const { data } = await axios.post(
                link,
                {
                    from_email: this.senderEmail,
                    from_name: this.senderName,
                    to: email,
                    subject: 'Сброс пароля на сайте green shop',
                    html: htmlBody,
                },

                {
                    headers: {
                        Authorization: `Bearer ${this.api_key}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            console.log(data);
        } catch (e) {
            if (e instanceof AxiosError) {
                this.loggerService.error(e.response?.data);
                this.loggerService.error(e.message);
                this.loggerService.error(e.stack || '');
            } else if (e instanceof Error) {
                this.loggerService.error(e.message);
                this.loggerService.error(e.stack || '');
            }
            throw new Error();
        }
    }
}
