import {
    CreateOrderRequestDto,
    CreateOrderResponseDto,
    GetMyOrdersResponseDto,
    GetOrderDetailsResponseDto,
} from 'contracts-green-shop';

export interface IOrderService {
    create(
        userId: string,
        cartId: string,
        { payment_method, address_id }: CreateOrderRequestDto,
    ): Promise<CreateOrderResponseDto>;
    getMyOrders(userId: string): Promise<GetMyOrdersResponseDto>;
    getOrderDetails(orderId: string): Promise<GetOrderDetailsResponseDto>;
    hasUserPurchasedProduct(userId: string, product_variant_id: string): Promise<boolean>;
}
