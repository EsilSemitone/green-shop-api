import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IOrderRepository } from './interfaces/order.repository.interface.ts';
import { APP_TYPES } from '../types.ts';
import { IDatabaseService } from '../core/database/database.service.interface.ts';
import { ICreateOrder } from './interfaces/crate-order.interface.ts';
import { ERROR } from '../common/error/error.ts';
import { HttpException } from '../common/exceptionFilter/http.exception.ts';
import { ORDER_STATUS } from 'contracts';
import { IExtendedOrder } from './interfaces/extended-order.interface.ts';
import { IGetOrdersByCriteria } from './interfaces/get-orders-by-criteria.interface.ts';
import { IUpdateOrder } from './interfaces/update-order.interface.ts';
import { CartItemModel } from '../common/models/cart-item-model.ts';
import { OrderItemModel } from '../common/models/order-item.model.ts';
import { OrderModel } from '../common/models/order.model.ts';
import { ProductVariantModel } from '../common/models/product-variant-model.ts';

@injectable()
export class OrderRepository implements IOrderRepository {
    constructor(@inject(APP_TYPES.DATABASE_SERVICE) private db: IDatabaseService) {}

    async create({
        userId,
        cartItems,
        payment_method,
        shipping_price,
        address,
    }: ICreateOrder): Promise<IExtendedOrder> {
        const res = await this.db.db.transaction(async (trx) => {
            const productVariants = await trx<ProductVariantModel>('product_variants').whereIn(
                'uuid',
                cartItems.map((item) => item.product_variant_id),
            );

            const orderItemsRaw = await Promise.all(
                cartItems.map(async (item) => {
                    const productVariant = productVariants.find((p) => p.uuid === item.product_variant_id);
                    if (!productVariant) {
                        throw new HttpException(ERROR.PRODUCT_VARIANT_NOT_FOUND, 404);
                    }

                    if (item.quantity > productVariant.stock) {
                        throw new HttpException(
                            ERROR.STOCK_ERROR(`${productVariant.uuid} ${item.quantity} > ${productVariant.stock}`),
                            400,
                        );
                    }

                    await trx<ProductVariantModel>('product_variants')
                        .update({
                            stock: productVariant.stock - item.quantity,
                        })
                        .where({ uuid: productVariant.uuid });

                    return {
                        product_variant_id: productVariant.uuid,
                        quantity: item.quantity,
                        price: productVariant.price,
                    };
                }),
            );

            await trx<CartItemModel>('cart_items')
                .delete()
                .whereIn(
                    'uuid',
                    cartItems.map((i) => i.uuid),
                );

            const total_price = orderItemsRaw.reduce((acc, order) => {
                return acc + Number(order.price) * Number(order.quantity);
            }, 0);

            const [order] = await trx<OrderModel>('orders')
                .insert({
                    user_id: userId,
                    status: ORDER_STATUS.CREATED,
                    shipping_price,
                    total_price: Number(total_price) + Number(shipping_price),
                    payment_method,
                    address,
                })
                .returning('*');

            const currentRawOrderItems = orderItemsRaw.map((i) => {
                return {
                    ...i,
                    order_id: order.uuid,
                };
            });
            const orderItems = await trx<OrderItemModel>('order_items').insert(currentRawOrderItems).returning('*');

            return {
                ...order,
                total_price: Number(order.total_price),
                shipping_price: Number(order.shipping_price),
                items: orderItems.map((item) => {
                    return {
                        ...item,
                        price: Number(item.price),
                    };
                }),
            };
        });

        return res;
    }

    async getOrdersByCriteria(query: IGetOrdersByCriteria): Promise<OrderModel[]> {
        const res = await this.db.db<OrderModel>('orders').where(query);
        return res;
    }

    async getOrderByUuid(uuid: string): Promise<OrderModel | null> {
        const res = await this.db.db<OrderModel>('orders').where({ uuid }).first();
        if (!res) {
            return null;
        }
        return {
            ...res,
            shipping_price: Number(res.shipping_price),
            total_price: Number(res.total_price),
        };
    }

    async getOrderByPaymentId(payment_id: string): Promise<OrderModel | null> {
        const res = await this.db.db<OrderModel>('orders').where({ payment_id }).first();
        if (!res) {
            return null;
        }
        return {
            ...res,
            shipping_price: Number(res.shipping_price),
            total_price: Number(res.total_price),
        };
    }

    async getOrderItemsByOrderUuid(uuid: string): Promise<OrderItemModel[]> {
        const res = await this.db.db<OrderItemModel>('order_items').where({ order_id: uuid });
        return res.map((i) => {
            return {
                ...i,
                price: Number(i.price),
            };
        });
    }

    async updateOrder(uuid: string, data: IUpdateOrder): Promise<OrderModel> {
        const [order] = await this.db.db<OrderModel>('orders').update(data).where({ uuid }).returning('*');
        return order;
    }

    async existOrderWithProductVariant(
        user_id: string,
        product_variant_id: string,
        status: ORDER_STATUS,
    ): Promise<boolean> {
        const res: OrderModel[] = await this.db.db
            .select('orders.*')
            .from('orders')
            .join('order_items as oi', 'orders.uuid', 'oi.order_id')
            .where({
                'orders.user_id': user_id,
                'orders.status': status,
                'oi.product_variant_id': product_variant_id,
            });

        return res.length > 0;
    }
}
