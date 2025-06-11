import { DeleteUserResponseDto, GetMeResponseDto, UpdateUserRequestDto, UpdateUserResponseDto } from 'contracts-green-shop';

export interface IUserService {
    me(userId: string): Promise<GetMeResponseDto>;
    update(userId: string, { password, ...otherUpdateData }: UpdateUserRequestDto): Promise<UpdateUserResponseDto>;
    delete(userId: string): Promise<DeleteUserResponseDto>;
}
