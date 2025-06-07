import { PaymentMethodModel } from '../../common/models/payment-method-model.interface.ts';
import { IGetPaymentMethodByUniqueCriteria } from './get-payment-method-by-unique-criteria.interface.ts';

export interface IPaymentMethodRepository {
    getByUniqueCriteria(query: IGetPaymentMethodByUniqueCriteria): Promise<PaymentMethodModel | null>;
    getAll(): Promise<PaymentMethodModel[]>;
}
