import { YookassaPaymentWebhookRequestDto } from '../dto/payment.dto';
import { ICreateYookassaPayment, ICreateYookassaPaymentReturn } from './create-yookassa-payment.interface';

export interface IYookassaService {
    createPayment({
        orderId,
        price,
        redirect_link,
        description,
    }: ICreateYookassaPayment): Promise<ICreateYookassaPaymentReturn>;
    handlePayment({ event, object }: YookassaPaymentWebhookRequestDto): Promise<void>;
}
