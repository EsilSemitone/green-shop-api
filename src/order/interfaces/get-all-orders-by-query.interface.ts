import { ORDER_BY_ORDERS, ORDER_STATUS, PAYMENT_METHOD } from 'contracts-green-shop';
import { OrderModel } from '../../common/models';

export interface IGetAllOrdersByQuery {
    limit: number;
    offset: number;
    orderBy: ORDER_BY_ORDERS;
    status?: ORDER_STATUS;
    payment_method?: PAYMENT_METHOD;
}

export interface IGetAllOrdersByQueryReturn {
    orders: OrderModel[];
    total: number;
}
