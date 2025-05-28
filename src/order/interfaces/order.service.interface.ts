import { CreateOrderRequestDto, CreateOrderResponseDto, GetMyOrdersResponseDto, GetOrderDetailsResponseDto } from 'contracts';

export interface IOrderService {
    create(
        userId: string,
        cartId: string,
        { payment_method, address_id }: CreateOrderRequestDto,
    ): Promise<CreateOrderResponseDto>;
    getMyOrders(userId: string): Promise<GetMyOrdersResponseDto>;
    getOrderDetails(orderId: string): Promise<GetOrderDetailsResponseDto>;
}
