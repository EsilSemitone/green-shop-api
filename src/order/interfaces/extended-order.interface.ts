import { OrderItem } from 'contracts';
import { OrderModel } from '../../common/models';

export interface IExtendedOrder extends OrderModel {
    items: OrderItem[];
}
