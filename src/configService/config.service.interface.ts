export interface IConfigService {
    get: (key: string) => string | null;
    getOrThrow: (key: string) => string;
}
