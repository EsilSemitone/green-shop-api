export class HttpException extends Error {
    constructor(
        message: string,
        public code: number,
        public path?: string,
        public context?: string,
    ) {
        super(message);
    }
}