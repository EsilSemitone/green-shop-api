import {
    CreateOrderRequestDto,
    CreateOrderResponseDto,
    GetAllOrdersRequestQueryDto,
    GetAllOrdersResponseDto,
    GetMyOrdersResponseDto,
    GetOrderDetailsResponseDto,
    UpdateOrderRequestDto,
    UpdateOrderResponseDto,
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
    getAllOrders(query: GetAllOrdersRequestQueryDto): Promise<GetAllOrdersResponseDto>;
    update(orderId: string, updateData: UpdateOrderRequestDto): Promise<UpdateOrderResponseDto>;
}
