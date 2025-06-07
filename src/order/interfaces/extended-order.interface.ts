import { OrderItem } from 'contracts';
import { OrderModel } from '../../common/models/order.model.ts';

export interface IExtendedOrder extends OrderModel {
    items: OrderItem[];
}
