import { OrderItem } from 'contracts-green-shop';
import { OrderModel } from '../../common/models/order.model.ts';

export interface IExtendedOrder extends OrderModel {
    items: OrderItem[];
}
