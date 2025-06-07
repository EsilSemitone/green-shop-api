import { TypeOf, z } from 'zod';

export const ConfigServiceSchema = z.object({
    API_PREFIX: z.string(),
    DOMAIN: z.string(),
    PORT: z.string(),
    SALT: z.string(),
    SECRET: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_HOST: z.string(),
    MAILOPOST_API_KEY: z.string(),
    CLIENT_URL: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    YOOKASSA_API_KEY: z.string(),
    YOOKASSA_SHOP_ID: z.string(),
});

export type Config = TypeOf<typeof ConfigServiceSchema>;
