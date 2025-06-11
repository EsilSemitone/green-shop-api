import { ORDER_STATUS } from 'contracts-green-shop';
import { ICreateOrder } from './crate-order.interface.ts';
import { IExtendedOrder } from './extended-order.interface.ts';
import { IGetOrdersByCriteria } from './get-orders-by-criteria.interface.ts';
import { IUpdateOrder } from './update-order.interface.ts';
import { OrderItemModel } from '../../common/models/order-item.model.ts';
import { OrderModel } from '../../common/models/order.model.ts';

export interface IOrderRepository {
    create({ userId, cartItems, payment_method, shipping_price }: ICreateOrder): Promise<IExtendedOrder>;
    getOrdersByCriteria(query: IGetOrdersByCriteria): Promise<OrderModel[]>;
    getOrderByUuid(uuid: string): Promise<OrderModel | null>;
    getOrderItemsByOrderUuid(uuid: string): Promise<OrderItemModel[]>;
    updateOrder(uuid: string, data: IUpdateOrder): Promise<OrderModel>;
    getOrderByPaymentId(payment_id: string): Promise<OrderModel | null>;
    existOrderWithProductVariant(user_id: string, product_variant_id: string, status: ORDER_STATUS): Promise<boolean>;
}
