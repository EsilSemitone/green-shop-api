import { RegisterSchemaRequestDto, RegisterSchemaResponseDto } from "contracts";

export interface IAuthService {
    register(dto: RegisterSchemaRequestDto): Promise<RegisterSchemaResponseDto>
}