export interface IEmailService {
    domain: string
    api_key: string
    senderName: string
    senderEmail: string

    sendRestoreCodeEmail(email: string, restoreCode: string): Promise<void>
}