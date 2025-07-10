import { ORDER_BY_ORDERS, ORDER_BY_ORDERS_ENUM } from 'contracts-green-shop';

export const orderByOrderMap = new Map<ORDER_BY_ORDERS, [string, string]>([
    [ORDER_BY_ORDERS_ENUM.FIRST_NEW, ['created_at', 'desc']],
    [ORDER_BY_ORDERS_ENUM.FIRST_OLD, ['created_at', 'adc']],
    [ORDER_BY_ORDERS_ENUM.FIRST_CHEAP, ['total_price', 'asc']],
    [ORDER_BY_ORDERS_ENUM.FIRST_EXPENSIVE, ['total_price', 'desc']],
]);
