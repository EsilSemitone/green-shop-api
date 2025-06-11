import { PAYMENT_METHOD } from 'contracts-green-shop';
import { CartItemModel } from '../../common/models/cart-item-model.ts';
import { AddressModel } from '../../common/models/address-model.ts';

export interface ICreateOrder {
    userId: string;
    payment_method: PAYMENT_METHOD;
    shipping_price: number;
    cartItems: CartItemModel[];
    address: AddressModel;
}
