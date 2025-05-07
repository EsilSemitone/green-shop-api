import { CreateCartResponseDto } from 'contracts';

export interface ICartService {
    create(userId: string): Promise<CreateCartResponseDto>;
}
