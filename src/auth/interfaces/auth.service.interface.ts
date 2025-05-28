import {
    LoginSchemaRequestDto,
    LogoutResponseDto,
    RegisterSchemaRequestDto,
    ResetPasswordRequestDto,
    ResetPasswordResponseDto,
    RestorePasswordResponseDto,
} from 'contracts';
import { IJwtPayload } from '../../core/jwtService/interfaces/jwt.payload';
import { IRegisterResponse } from './register';
import { ILoginResponse } from './login';

export interface IAuthService {
    register(dto: RegisterSchemaRequestDto): Promise<IRegisterResponse>;
    login({ email, password }: LoginSchemaRequestDto): Promise<ILoginResponse>;
    logout(refreshToken: string | undefined, { userId }: IJwtPayload): Promise<LogoutResponseDto>;
    restorePassword(email: string): Promise<RestorePasswordResponseDto>;
    resetPassword(data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto>;
    refresh(refreshToken: string | undefined): Promise<ILoginResponse>;
}
