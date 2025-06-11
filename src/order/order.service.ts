import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { APP_TYPES } from '../types.ts';
import { IOrderService } from './interfaces/order.service.interface.ts';
import {
    CreateOrderRequestDto,
    CreateOrderResponseDto,
    GetMyOrdersResponseDto,
    GetOrderDetailsResponseDto,
    ORDER_STATUS,
    PAYMENT_METHOD,
} from 'contracts-green-shop';
import { IOrderRepository } from './interfaces/order.repository.interface.ts';
import { IPaymentMethodRepository } from '../payment-method/interfaces/payment-method.repository.interface.ts';
import { HttpException } from '../common/exceptionFilter/http.exception.ts';
import { ERROR } from '../common/error/error.ts';
import { ICartRepository } from '../cart/interfaces/cart.repository.interface.ts';
import { IAddressRepository } from '../address/interfaces/address.repository.interface.ts';
import { IYookassaService } from '../integration/yookassa/interfaces/yookassa.service.interface.ts';
import { IConfigService } from '../core/configService/config.service.interface.ts';
import { ILogger } from '../core/logger/logger.service.interface.ts';

@injectable()
export class OrderService implements IOrderService {
    clientUrl: string;
    constructor(
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
        @inject(APP_TYPES.ORDER_REPOSITORY) private orderRepository: IOrderRepository,
        @inject(APP_TYPES.PAYMENT_METHOD_REPOSITORY) private paymentMethodRepository: IPaymentMethodRepository,
        @inject(APP_TYPES.CART_REPOSITORY) private cartRepository: ICartRepository,
        @inject(APP_TYPES.ADDRESS_REPOSITORY) private addressRepository: IAddressRepository,
        @inject(APP_TYPES.YOOKASSA_SERVICE) private yookassaService: IYookassaService,
        @inject(APP_TYPES.CONFIG_SERVICE) private configService: IConfigService,
    ) {
        this.loggerService.setServiceName(OrderService.name);
        this.clientUrl = this.configService.getOrThrow('CLIENT_URL');
    }

    async create(
        userId: string,
        cartId: string,
        { payment_method, address_id }: CreateOrderRequestDto,
    ): Promise<CreateOrderResponseDto> {
        this.loggerService.log(
            `Start service create order with params ${JSON.stringify({ userId, payment_method, address_id })}`,
        );

        const payment = await this.paymentMethodRepository.getByUniqueCriteria({ name: payment_method });

        if (!payment) {
            throw new HttpException(ERROR.PAYMENT_METHOD_IS_NOT_FOUND, 404);
        }

        const items = await this.cartRepository.getCartItemsByCriteria({ cart_id: cartId });

        if (items.length === 0) {
            throw new HttpException(ERROR.CART_ITEM_IS_NOT_FOUND, 404);
        }

        const address = await this.addressRepository.getByUuid(address_id);
        if (!address) {
            throw new HttpException(ERROR.ADDRESS_IS_NOT_FOUND, 404);
        }

        const order = await this.orderRepository.create({
            userId: userId,
            payment_method: payment.name as PAYMENT_METHOD,
            shipping_price: payment.price,
            cartItems: items,
            address: address,
        });

        const paymentMethodStrategy = new Map<PAYMENT_METHOD, () => Promise<CreateOrderResponseDto>>([
            [
                PAYMENT_METHOD.CASH,
                async () => {
                    this.loggerService.log(`Success service create order`);
                    return {
                        isSuccess: true,
                        payload: {
                            data: order,
                        },
                    };
                },
            ],
            [
                PAYMENT_METHOD.YOOKASSA,
                async () => {
                    try {
                        const { url, id } = await this.yookassaService.createPayment({
                            orderId: order.uuid,
                            price: String(order.total_price),
                            redirect_link: this.clientUrl,
                            description: `Оплата товаров на Green Shop на сумму ${order.total_price}`,
                        });

                        const updatedOrder = await this.orderRepository.updateOrder(order.uuid, { payment_id: id });

                        this.loggerService.log(`Success service create order`);
                        return {
                            isSuccess: true,
                            payload: {
                                data: {
                                    ...updatedOrder,
                                    items: order.items,
                                },
                                payment_link: url,
                            },
                        };
                    } catch {
                        this.loggerService.error(`Success service create order, YOOKASSA error`);

                        return {
                            isSuccess: false,
                            payload: {
                                data: order,
                            },
                        };
                    }
                },
            ],
        ]);

        const strategy = paymentMethodStrategy.get(payment_method);

        if (!strategy) {
            throw new HttpException(ERROR.PAYMENT_METHOD_IS_NOT_FOUND, 404);
        }

        const res = await strategy();
        return res;
    }

    async getMyOrders(userId: string): Promise<GetMyOrdersResponseDto> {
        this.loggerService.log(`Start service get my orders with params ${JSON.stringify({ userId })}`);

        const orders = await this.orderRepository.getOrdersByCriteria({ user_id: userId });

        this.loggerService.log(`Success service get my orders`);
        return {
            orders,
        };
    }

    async getOrderDetails(orderId: string): Promise<GetOrderDetailsResponseDto> {
        this.loggerService.log(`Start service get order details with params ${JSON.stringify({ orderId })}`);

        const order = await this.orderRepository.getOrderByUuid(orderId);

        if (!order) {
            throw new HttpException(ERROR.ORDER_IS_NOT_FOUND, 404);
        }

        const orderItems = await this.orderRepository.getOrderItemsByOrderUuid(orderId);

        this.loggerService.log(`Success service get order details`);
        return {
            ...order,
            items: orderItems,
        };
    }

    async hasUserPurchasedProduct(userId: string, product_variant_id: string): Promise<boolean> {
        this.loggerService.log(
            `Start service hasUserPurchasedProduct with params ${JSON.stringify({ userId, product_variant_id })}`,
        );

        const isUserHasPurchasedProduct = await this.orderRepository.existOrderWithProductVariant(
            userId,
            product_variant_id,
            ORDER_STATUS.PAID,
        );

        this.loggerService.log(`Success service hasUserPurchasedProduct`);
        return isUserHasPurchasedProduct;
    }
}
