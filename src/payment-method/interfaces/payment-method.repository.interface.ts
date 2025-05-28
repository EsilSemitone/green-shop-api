import { PaymentMethodModel } from '../../common/models';
import { IGetPaymentMethodByUniqueCriteria } from './get-payment-method-by-unique-criteria.interface';

export interface IPaymentMethodRepository {
    getByUniqueCriteria(query: IGetPaymentMethodByUniqueCriteria): Promise<PaymentMethodModel | null>;
    getAll(): Promise<PaymentMethodModel[]>;
}
