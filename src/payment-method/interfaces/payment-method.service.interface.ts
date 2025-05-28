import { GetPaymentMethodsResponseDto } from 'contracts';

export interface IPaymentMethodService {
    getPaymentMethods(): Promise<GetPaymentMethodsResponseDto>;
}
