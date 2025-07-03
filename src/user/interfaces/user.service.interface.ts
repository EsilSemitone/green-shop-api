import {
    AddAdminUserResponseDto,
    DeleteUserResponseDto,
    GetAllUsersRequestQueryDto,
    GetAllUsersResponseDto,
    GetMeResponseDto,
    GetStatsUsersRequestParamsDto,
    GetStatsUsersResponseDto,
    GetUserResponseDto,
    UpdateUserRequestDto,
    UpdateUserResponseDto,
} from 'contracts-green-shop';

export interface IUserService {
    me(userId: string): Promise<GetMeResponseDto>;
    update(userId: string, { password, ...otherUpdateData }: UpdateUserRequestDto): Promise<UpdateUserResponseDto>;
    delete(userId: string): Promise<DeleteUserResponseDto>;
    getAll(dto: GetAllUsersRequestQueryDto): Promise<GetAllUsersResponseDto>;
    getUser(userId: string): Promise<GetUserResponseDto>;
    addAdminUser(email: string): Promise<AddAdminUserResponseDto>;
    getStats(dto: GetStatsUsersRequestParamsDto): Promise<GetStatsUsersResponseDto>;
}
