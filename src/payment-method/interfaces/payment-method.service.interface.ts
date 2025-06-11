import { GetPaymentMethodsResponseDto } from 'contracts-green-shop';

export interface IPaymentMethodService {
    getPaymentMethods(): Promise<GetPaymentMethodsResponseDto>;
}
