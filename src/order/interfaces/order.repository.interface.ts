import { OrderItemModel, OrderModel } from '../../common/models';
import { ICreateOrder } from './crate-order.interface';
import { IExtendedOrder } from './extended-order.interface';
import { IGetOrdersByCriteria } from './get-orders-by-criteria.interface';
import { IUpdateOrder } from './update-order.interface';

export interface IOrderRepository {
    create({ userId, cartItems, payment_method, shipping_price }: ICreateOrder): Promise<IExtendedOrder>;
    getOrdersByCriteria(query: IGetOrdersByCriteria): Promise<OrderModel[]>;
    getOrderByUuid(uuid: string): Promise<OrderModel | null>;
    getOrderItemsByOrderUuid(uuid: string): Promise<OrderItemModel[]>;
    updateOrder(uuid: string, data: IUpdateOrder): Promise<OrderModel>;
    getOrderByPaymentId(payment_id: string): Promise<OrderModel | null>;
}
