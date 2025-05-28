import { ORDER_STATUS, PAYMENT_METHOD } from 'contracts';
import { AddressModel } from './address-model';

export interface OrderModel {
    uuid: string;
    user_id: string;
    status: ORDER_STATUS;
    shipping_price: number;
    total_price: number;
    payment_method: PAYMENT_METHOD;
    address: AddressModel;
    payment_id: string | null;
    created_at: Date;
    updated_at: Date;
}
