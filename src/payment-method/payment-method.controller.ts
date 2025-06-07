import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Controller } from '../common/abstract.controller.ts';
import { IController } from '../common/interfaces/controller.interface.ts';
import { APP_TYPES } from '../types.ts';
import { Request, Response } from 'express';
import { IPaymentMethodService } from './interfaces/payment-method.service.interface.ts';

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
