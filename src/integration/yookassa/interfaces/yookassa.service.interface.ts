import { YookassaPaymentWebhookRequestDto } from '../dto/payment.dto.ts';
import { ICreateYookassaPayment, ICreateYookassaPaymentReturn } from './create-yookassa-payment.interface.ts';

export interface IYookassaService {
    createPayment({
        orderId,
        price,
        redirect_link,
        description,
    }: ICreateYookassaPayment): Promise<ICreateYookassaPaymentReturn>;
    handlePayment({ event, object }: YookassaPaymentWebhookRequestDto): Promise<void>;
}
