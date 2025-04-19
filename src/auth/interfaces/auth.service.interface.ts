import {  LoginSchemaRequestDto, LoginSchemaResponseDto, RegisterSchemaRequestDto, RegisterSchemaResponseDto, ResetPasswordRequestDto, ResetPasswordResponseDto, RestorePasswordResponseDto } from "contracts";

export interface IAuthService {
    register(dto: RegisterSchemaRequestDto): Promise<RegisterSchemaResponseDto>
    login({email, password}: LoginSchemaRequestDto): Promise<LoginSchemaResponseDto>
    restorePassword(email: string): Promise<RestorePasswordResponseDto>
    resetPassword(data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> 
}