import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ITagService } from './interfaces/tag.service.interface';
import { APP_TYPES } from '../types';
import {
    CreateTagRequestDto,
    CreateTagResponseDto,
    DeleteTagResponseDto,
    GetAllTagsResponseDto,
} from 'contracts-green-shop';
import { ILogger } from '../core/logger/logger.service.interface';
import { ITagRepository } from './interfaces/tag.repository.interface';
import { HttpException } from '../common/exceptionFilter/http.exception';
import { ERROR } from '../common/error/error';

@injectable()
export class TagService implements ITagService {
    constructor(
        @inject(APP_TYPES.TAG_REPOSITORY) private tagRepository: ITagRepository,
        @inject(APP_TYPES.LOGGER_SERVICE) private loggerService: ILogger,
    ) {
        this.loggerService.setServiceName(TagService.name);
    }

    async getAll(): Promise<GetAllTagsResponseDto> {
        this.loggerService.log('Start service getAll');

        const result = await this.tagRepository.getAll();

        this.loggerService.log('Success service getAll');
        return {
            tags: result,
        };
    }

    async create(dto: CreateTagRequestDto): Promise<CreateTagResponseDto> {
        this.loggerService.log(`Start service create with params ${JSON.stringify(dto)}`);

        const { name } = dto;

        const isTagExist = await this.tagRepository.getByUniqueCriteria({ name });

        if (isTagExist) {
            throw new HttpException(ERROR.TAG_ALREADY_EXIST, 400);
        }

        const tag = await this.tagRepository.create(dto);

        this.loggerService.log('Success service create');
        return tag;
    }

    async delete(uuid: string): Promise<DeleteTagResponseDto> {
        this.loggerService.log(`Start service delete with params ${JSON.stringify({ uuid })}`);

        await this.tagRepository.delete(uuid);
        this.loggerService.log('Success service delete');
        return { isSuccess: true };
    }
}
