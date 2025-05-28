import 'reflect-metadata';
import { IYookassaService } from './interfaces/yookassa.service.interface';
import { inject, injectable } from 'inversify';
import { APP_TYPES } from '../../types';
import { ILogger } from '../../core/logger/logger.service.interface';
import { IConfigService } from '../../core/configService/config.service.interface';
import { YooCheckout } from '@a2seven/yoo-checkout';
import { ICreateYookassaPayment, ICreateYookassaPaymentReturn } from './interfaces/create-yookassa-payment.interface';
import { HttpException } from '../../common/exceptionFilter/http.exception';
import { ERROR } from '../../common/error/error';
import { YookassaPaymentWebhookRequestDto } from './dto/payment.dto';
import { YOOKASSA_EVENT } from './enums/yookassa-event';
import { IOrderRepository } from '../../order/interfaces/order.repository.interface';
import { ORDER_STATUS } from 'contracts';

@injectable()
export class YookassaService implements IYookassaService {
    apiKey: string;
    shopId: string;

    checkout: YooCheckout;

    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
        @inject(APP_TYPES.ORDER_REPOSITORY) private orderRepository: IOrderRepository,
    ) {
        this.loggerService.setServiceName(YookassaService.name);

        this.apiKey = this.configService.getOrThrow('YOOKASSA_API_KEY');
        this.shopId = this.configService.getOrThrow('YOOKASSA_SHOP_ID');

        this.checkout = new YooCheckout({ shopId: this.shopId, secretKey: this.apiKey });
    }

    async createPayment({
        orderId,
        price,
        redirect_link,
        description,
    }: ICreateYookassaPayment): Promise<ICreateYookassaPaymentReturn> {
        this.loggerService.log(
            `Start service createPayment [Yookassa] with params ${JSON.stringify({
                price,
                redirect_link,
                description,
            })}`,
        );

        try {
            const payment = await this.checkout.createPayment(
                {
                    amount: {
                        value: price,
                        currency: 'RUB',
                    },
                    payment_method_data: {
                        type: 'bank_card',
                    },
                    confirmation: {
                        type: 'redirect',
                        return_url: redirect_link,
                    },
                },
                orderId,
            );

            this.loggerService.log('Success service createPayment [Yookassa]');

            return {
                url: payment.confirmation.confirmation_url,
                id: payment.id,
            };
        } catch {
            throw new HttpException(ERROR.PAYMENT_ERROR, 500);
        }
    }

    async handlePayment({ event, object }: YookassaPaymentWebhookRequestDto): Promise<void> {
        this.loggerService.log(
            `Start service handle payment notification with params: ${JSON.stringify({ event, object })}`,
        );
        const handlePaymentEvent = new Map<YOOKASSA_EVENT, () => Promise<void>>([
            [
                YOOKASSA_EVENT.SUCCESS,
                async () => {
                    const order = await this.orderRepository.getOrderByPaymentId(object.id);

                    if (!order) {
                        throw new HttpException(ERROR.ORDER_IS_NOT_FOUND, 404);
                    }

                    await this.orderRepository.updateOrder(order.uuid, { status: ORDER_STATUS.PAID });
                },
            ],
            [
                YOOKASSA_EVENT.CANCEL,
                async () => {
                    const order = await this.orderRepository.getOrderByPaymentId(object.id);

                    if (!order) {
                        throw new HttpException(ERROR.ORDER_IS_NOT_FOUND, 404);
                    }

                    await this.orderRepository.updateOrder(order.uuid, { status: ORDER_STATUS.CANCELED });
                },
            ],
        ]);

        const handle = handlePaymentEvent.get(event);

        if (!handle) {
            throw new HttpException(ERROR.YOOKASSA_EVENT_ERROR, 400);
        }

        await handle();
    }
}
