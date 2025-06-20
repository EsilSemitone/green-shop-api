import { Container } from 'inversify';
import { IOrderService } from './interfaces/order.service.interface';
import { ILogger } from '../core/logger/logger.service.interface';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { IPaymentMethodRepository } from '../payment-method/interfaces/payment-method.repository.interface';
import { ICartRepository } from '../cart/interfaces/cart.repository.interface';
import { IAddressRepository } from '../address/interfaces/address.repository.interface';
import { IYookassaService } from '../integration/yookassa/interfaces/yookassa.service.interface';
import { IConfigService } from '../core/configService/config.service.interface';
import { APP_TYPES } from '../types';
import { OrderService } from './order.service';
import { randomUUID } from 'crypto';
import { ORDER_STATUS, PAYMENT_METHOD } from 'contracts-green-shop';
import { ERROR } from '../common/error/error';
import { AddressModel, CartItemModel, OrderItemModel, PaymentMethodModel } from '../common/models';
import { IExtendedOrder } from './interfaces/extended-order.interface';

let orderService: IOrderService;

const loggerServiceMock: jest.Mocked<ILogger> = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setServiceName: jest.fn(),
};

const orderRepositoryMock: jest.Mocked<IOrderRepository> = {
    create: jest.fn(),
    getOrdersByCriteria: jest.fn(),
    getOrderByUuid: jest.fn(),
    getOrderItemsByOrderUuid: jest.fn(),
    updateOrder: jest.fn(),
    getOrderByPaymentId: jest.fn(),
    existOrderWithProductVariant: jest.fn(),
};

const paymentMethodRepositoryMock: jest.Mocked<IPaymentMethodRepository> = {
    getByUniqueCriteria: jest.fn(),
    getAll: jest.fn(),
};

const cartRepositoryMock: jest.Mocked<ICartRepository> = {
    getCartByUniqueCriteria: jest.fn(),
    create: jest.fn(),
    getCartItemsByCriteria: jest.fn(),
    createCartItem: jest.fn(),
    getCartItemByUuid: jest.fn(),
    deleteCartItem: jest.fn(),
    updateCartItem: jest.fn(),
};

const addressRepositoryMock: jest.Mocked<IAddressRepository> = {
    create: jest.fn(),
    delete: jest.fn(),
    getByUuid: jest.fn(),
    getAll: jest.fn(),
};

const yookassaServiceMock: jest.Mocked<IYookassaService> = {
    handlePayment: jest.fn(),
    createPayment: jest.fn(),
};

const configServiceMock: jest.Mocked<IConfigService> = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
};

beforeAll(() => {
    const container = new Container();

    container.bind<IOrderService>(APP_TYPES.ORDER_SERVICE).to(OrderService);
    container.bind<ILogger>(APP_TYPES.LOGGER_SERVICE).toConstantValue(loggerServiceMock);
    container.bind<IOrderRepository>(APP_TYPES.ORDER_REPOSITORY).toConstantValue(orderRepositoryMock);
    container
        .bind<IPaymentMethodRepository>(APP_TYPES.PAYMENT_METHOD_REPOSITORY)
        .toConstantValue(paymentMethodRepositoryMock);
    container.bind<ICartRepository>(APP_TYPES.CART_REPOSITORY).toConstantValue(cartRepositoryMock);
    container.bind<IAddressRepository>(APP_TYPES.ADDRESS_REPOSITORY).toConstantValue(addressRepositoryMock);
    container.bind<IYookassaService>(APP_TYPES.YOOKASSA_SERVICE).toConstantValue(yookassaServiceMock);
    container.bind<IConfigService>(APP_TYPES.CONFIG_SERVICE).toConstantValue(configServiceMock);

    orderService = container.get(APP_TYPES.ORDER_SERVICE);
});

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Order service', () => {
    const paymentMethod: PaymentMethodModel = {
        uuid: randomUUID(),
        price: 199,
        name: PAYMENT_METHOD.CASH,
        description: 'оплата ...',
        created_at: new Date(),
        updated_at: new Date(),
    };

    const cartItem: CartItemModel = {
        uuid: randomUUID(),
        cart_id: randomUUID(),
        product_variant_id: randomUUID(),
        quantity: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const address: AddressModel = {
        uuid: randomUUID(),
        user_id: randomUUID(),
        city: 'город',
        street_address: 'улица',
        phone_number: null,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const orderId = randomUUID();

    const orderItem: OrderItemModel = {
        uuid: randomUUID(),
        order_id: orderId,
        product_variant_id: randomUUID(),
        quantity: 0,
        price: 0,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const order: IExtendedOrder = {
        items: [orderItem],
        uuid: orderId,
        user_id: randomUUID(),
        status: ORDER_STATUS.CREATED,
        shipping_price: 199,
        total_price: 1299,
        payment_method: PAYMENT_METHOD.CASH,
        address: address,
        payment_id: paymentMethod.uuid,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const userId = randomUUID();
    const cartId = randomUUID();

    configServiceMock.getOrThrow.mockReturnValue('url');

    describe('create', () => {
        const createData = {
            payment_method: PAYMENT_METHOD.CASH,
            address_id: randomUUID(),
        };

        it('should throw error (payment method not found)', async () => {
            paymentMethodRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(null);

            await expect(orderService.create(userId, cartId, createData)).rejects.toThrow(
                ERROR.PAYMENT_METHOD_IS_NOT_FOUND,
            );
            expect(paymentMethodRepositoryMock.getByUniqueCriteria).toHaveBeenCalledWith({
                name: createData.payment_method,
            });
        });

        it('should throw error (cart is empty)', async () => {
            paymentMethodRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(paymentMethod);
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([]);

            await expect(orderService.create(userId, cartId, createData)).rejects.toThrow(ERROR.CART_ITEM_IS_NOT_FOUND);
            expect(cartRepositoryMock.getCartItemsByCriteria).toHaveBeenCalledWith({ cart_id: cartId });
        });

        it('should throw error (address is not found)', async () => {
            paymentMethodRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(paymentMethod);
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([{ ...cartItem, cart_id: cartId }]);
            addressRepositoryMock.getByUuid.mockResolvedValueOnce(null);

            await expect(orderService.create(userId, cartId, createData)).rejects.toThrow(ERROR.ADDRESS_IS_NOT_FOUND);
            expect(addressRepositoryMock.getByUuid).toHaveBeenCalledWith(createData.address_id);
        });

        it('should create order and return success with order (payment method cache)', async () => {
            paymentMethodRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(paymentMethod);
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([{ ...cartItem, cart_id: cartId }]);
            addressRepositoryMock.getByUuid.mockResolvedValueOnce(address);
            orderRepositoryMock.create.mockResolvedValueOnce(order);

            const result = await orderService.create(userId, cartId, createData);

            expect(result).toEqual({
                isSuccess: true,
                payload: {
                    data: order,
                },
            });

            expect(orderRepositoryMock.create).toHaveBeenLastCalledWith({
                userId: userId,
                payment_method: paymentMethod.name,
                shipping_price: paymentMethod.price,
                cartItems: [{ ...cartItem, cart_id: cartId }],
                address: address,
            });
        });

        it('should create order and return success with order (payment method yookassa)', async () => {
            const createPaymentReturn = {
                url: 'url',
                id: 'id',
            };
            paymentMethodRepositoryMock.getByUniqueCriteria.mockResolvedValueOnce(paymentMethod);
            cartRepositoryMock.getCartItemsByCriteria.mockResolvedValueOnce([{ ...cartItem, cart_id: cartId }]);
            addressRepositoryMock.getByUuid.mockResolvedValueOnce(address);
            orderRepositoryMock.create.mockResolvedValueOnce(order);

            yookassaServiceMock.createPayment.mockResolvedValueOnce(createPaymentReturn);
            orderRepositoryMock.updateOrder.mockResolvedValueOnce({ ...order, payment_id: createPaymentReturn.id });

            const result = await orderService.create(userId, cartId, {
                ...createData,
                payment_method: PAYMENT_METHOD.YOOKASSA,
            });

            expect(result).toEqual({
                isSuccess: true,
                payload: {
                    data: { ...order, payment_id: createPaymentReturn.id },
                    payment_link: createPaymentReturn.url,
                },
            });

            expect(yookassaServiceMock.createPayment).toHaveBeenLastCalledWith({
                orderId: order.uuid,
                price: String(order.total_price),
                redirect_link: 'url',
                description: `Оплата товаров на Green Shop на сумму ${order.total_price}`,
            });

            expect(orderRepositoryMock.updateOrder).toHaveBeenCalledWith(order.uuid, {
                payment_id: createPaymentReturn.id,
            });
        });
    });

    describe('getMyOrders', () => {
        it('should find orders and return', async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { items, ...baseOrder } = order;
            orderRepositoryMock.getOrdersByCriteria.mockResolvedValueOnce([baseOrder]);

            const result = await orderService.getMyOrders(userId);

            expect(result).toEqual({ orders: [baseOrder] });
            expect(orderRepositoryMock.getOrdersByCriteria).toHaveBeenCalledWith({ user_id: userId });
        });
    });

    describe('getOrderDetails', () => {
        it('should throw error (order not found)', async () => {
            orderRepositoryMock.getOrderByUuid.mockResolvedValueOnce(null);

            await expect(orderService.getOrderDetails(orderId)).rejects.toThrow(ERROR.ORDER_IS_NOT_FOUND);
            expect(orderRepositoryMock.getOrderByUuid).toHaveBeenCalledWith(orderId);
        });

        it('should find order details and return these', async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { items, ...baseOrder } = order;
            orderRepositoryMock.getOrderByUuid.mockResolvedValueOnce(baseOrder);
            orderRepositoryMock.getOrderItemsByOrderUuid.mockResolvedValueOnce([orderItem]);

            const result = await orderService.getOrderDetails(orderId);

            expect(result).toEqual({
                ...baseOrder,
                items: [orderItem],
            });
        });
    });

    describe('hasUserPurchasedProduct', () => {
        it('should return result', async () => {
            const product_variant_id = randomUUID();
            orderRepositoryMock.existOrderWithProductVariant.mockResolvedValueOnce(true);

            const result = await orderService.hasUserPurchasedProduct(userId, product_variant_id);
            expect(result).toBe(true);
            expect(orderRepositoryMock.existOrderWithProductVariant).toHaveBeenCalledWith(
                userId,
                product_variant_id,
                ORDER_STATUS.PAID,
            );
        });
    });
});
