import {
    LoginSchemaRequestDto,
    LoginSchemaResponseDto,
    LogoutRequestDto,
    LogoutResponseDto,
    RegisterSchemaRequestDto,
    RegisterSchemaResponseDto,
    ResetPasswordRequestDto,
    ResetPasswordResponseDto,
    RestorePasswordResponseDto,
} from 'contracts';
import { IJwtPayload } from '../../core/jwtService/interfaces/jwt.payload';

export interface IAuthService {
    register(dto: RegisterSchemaRequestDto): Promise<RegisterSchemaResponseDto>;
    login({ email, password }: LoginSchemaRequestDto): Promise<LoginSchemaResponseDto>;
    logout({ refreshToken }: LogoutRequestDto, { userId }: IJwtPayload): Promise<LogoutResponseDto>;
    restorePassword(email: string): Promise<RestorePasswordResponseDto>;
    resetPassword(data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto>;
}
