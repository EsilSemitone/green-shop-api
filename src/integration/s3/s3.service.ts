import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types';
import { IConfigService } from '../../core/configService/config.service.interface';
import { ILogger } from '../../core/logger/logger.service.interface';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@injectable()
export class S3Service {
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
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_KEY!,
            },
        });
    }

    async uploadFile(path: string, file: Express.Multer.File): Promise<string> {
        try {
            this.loggerService.log(`Start service uploadFile with params: ${JSON.stringify({ path })}`);
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${path}/${randomUUID()}.${fileExt}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.client.send(command);
            this.loggerService.log('Success service uploadFile');
            return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        } catch (e) {
            this.loggerService.error(`Error service s3 upload file`);
            if (e instanceof Error) {
                this.loggerService.error(`${e.name},${e.name},${e.stack}`);
            }
        }
    }
}
