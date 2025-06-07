import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IPaymentMethodRepository } from './interfaces/payment-method.repository.interface.ts';
import { APP_TYPES } from '../types.ts';
import { IDatabaseService } from '../core/database/database.service.interface.ts';
import { IGetPaymentMethodByUniqueCriteria } from './interfaces/get-payment-method-by-unique-criteria.interface.ts';
import { PaymentMethodModel } from '../common/models/payment-method-model.interface.ts';

@injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async getByUniqueCriteria(query: IGetPaymentMethodByUniqueCriteria): Promise<PaymentMethodModel | null> {
        const price = await this.db.db<PaymentMethodModel>('payment_methods').where(query).first();
        return price || null;
    }

    async getAll(): Promise<PaymentMethodModel[]> {
        const res = await this.db.db<PaymentMethodModel>('payment_methods');
        return res;
    }
}
