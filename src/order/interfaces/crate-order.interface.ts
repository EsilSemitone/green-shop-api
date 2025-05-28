import { PAYMENT_METHOD } from 'contracts';
import { AddressModel, CartItemModel } from '../../common/models';

export interface ICreateOrder {
    userId: string;
    payment_method: PAYMENT_METHOD;
    shipping_price: number;
    cartItems: CartItemModel[];
    address: AddressModel;
}
