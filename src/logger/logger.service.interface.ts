export interface ILogger {
    log: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;

    setServiceName: (name: string) => void;
}
