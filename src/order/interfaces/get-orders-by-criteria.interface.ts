import { ORDER_STATUS, PAYMENT_METHOD } from 'contracts-green-shop';

export interface IGetOrdersByCriteria {
    user_id?: string;
    status?: ORDER_STATUS;
    payment_method?: PAYMENT_METHOD;
    payment_id?: string;
}
