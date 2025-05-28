import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller';
import { IController } from '../common/interfaces/controller.interface';
import { APP_TYPES } from '../types';
import { Request, Response } from 'express';
import { IPaymentMethodService } from './interfaces/payment-method.service.interface';

@injectable()
export class PaymentMethodController extends Controller implements IController {
    constructor(@inject(APP_TYPES.PAYMENT_METHOD_SERVICE) private paymentMethodService: IPaymentMethodService) {
        super();
        this.bindRouts([
            {
                method: 'get',
                path: '/',
                func: this.getPaymentMethods,
                middlewares: [],
            },
        ]);
    }

    async getPaymentMethods(req: Request, res: Response) {
        const result = await this.paymentMethodService.getPaymentMethods();
        this.ok(res, result);
    }
}
