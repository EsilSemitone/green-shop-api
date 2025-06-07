import { Config } from "./interfaces/config.service.schema.ts";

export interface IConfigService {
    get: (key: keyof Config) => string | null;
    getOrThrow: (key: keyof Config) => string;
}
