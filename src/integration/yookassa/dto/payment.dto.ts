import { Payment } from '@a2seven/yoo-checkout';
import { YOOKASSA_EVENT } from '../enums/yookassa-event.ts';

export interface YookassaPaymentWebhookRequestDto {
    type: 'notification';
    event: YOOKASSA_EVENT;
    object: Payment;
}
