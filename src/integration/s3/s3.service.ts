import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types';
import { IConfigService } from '../../core/configService/config.service.interface';
import { ILogger } from '../../core/logger/logger.service.interface';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { IS3Service } from './interfaces/s3.service.interface';

@injectable()
export class S3Service implements IS3Service {
    bucketName: string;
    accessKey: string;
    secretAccessKey: string;
    client: S3Client;
    constructor(
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
    ) {
        this.accessKey = this.configService.getOrThrow('S3_ACCESS_KEY');
        this.secretAccessKey = this.configService.getOrThrow('S3_SECRET_ACCESS_KEY');
        this.bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');

        this.client = new S3Client({
            endpoint: 'https://s3.regru.cloud',
            region: 'eu-central-1',
            credentials: {
                accessKeyId: this.accessKey,
                secretAccessKey: this.secretAccessKey,
            },
        });
    }

    async uploadFile(path: string, file: Express.Multer.File): Promise<string> {
        try {
            this.loggerService.log(`Start service uploadFile with params: ${JSON.stringify({ path })}`);
            const fileExt = file.originalname.split('.').pop();
            const fullPath = `${path}/${randomUUID()}.${fileExt}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fullPath,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.client.send(command);

            this.loggerService.log('Success service uploadFile');
            return `https://s3.regru.cloud/green-shop/${fullPath}`;
        } catch (e) {
            this.loggerService.error(`Error service s3 upload file`);
            if (e instanceof Error) {
                this.loggerService.error(`${e.name},${e.name},${e.stack}`);
                throw new Error(e.message);
            }
            throw new Error();
        }
    }
}
