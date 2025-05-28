import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IPaymentMethodService } from './interfaces/payment-method.service.interface';
import { APP_TYPES } from '../types';
import { IPaymentMethodRepository } from './interfaces/payment-method.repository.interface';
import { GetPaymentMethodsResponseDto } from 'contracts';
import { ILogger } from '../core/logger/logger.service.interface';

@injectable()
export class PaymentMethodService implements IPaymentMethodService {
    constructor(
        @inject(APP_TYPES.PAYMENT_METHOD_REPOSITORY) private paymentMethodRepository: IPaymentMethodRepository,
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
    ) {
        this.loggerService.setServiceName(PaymentMethodService.name);
    }

    async getPaymentMethods(): Promise<GetPaymentMethodsResponseDto> {
        this.loggerService.log(`Start service getPaymentMethods`);

        const methods = await this.paymentMethodRepository.getAll();

        this.loggerService.log(`Success service getPaymentMethods`);
        return {
            methods,
        };
    }
}
