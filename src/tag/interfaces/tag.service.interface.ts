import {
    CreateTagRequestDto,
    CreateTagResponseDto,
    DeleteTagResponseDto,
    GetAllTagsResponseDto,
} from 'contracts-green-shop';

export interface ITagService {
    getAll(): Promise<GetAllTagsResponseDto>;
    create(dto: CreateTagRequestDto): Promise<CreateTagResponseDto>;
    delete(uuid: string): Promise<DeleteTagResponseDto>;
}
