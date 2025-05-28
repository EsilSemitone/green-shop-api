import { ORDER_STATUS, PAYMENT_METHOD } from 'contracts';

export interface IGetOrdersByCriteria {
    user_id?: string;
    status?: ORDER_STATUS;
    payment_method?: PAYMENT_METHOD;
    payment_id?: string;
}
