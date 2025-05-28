import { ORDER_STATUS, PAYMENT_METHOD } from 'contracts';
import { AddressModel } from '../../common/models';

export interface IUpdateOrder {
    status?: ORDER_STATUS;
    shipping_price?: number;
    total_price?: number;
    payment_method?: PAYMENT_METHOD;
    address?: AddressModel;
    payment_id?: string | null;
}
