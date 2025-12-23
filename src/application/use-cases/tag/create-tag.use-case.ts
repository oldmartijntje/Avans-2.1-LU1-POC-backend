import { Injectable, Inject } from '@nestjs/common';
import { TAG_REPOSITORY, type ITagRepository } from '../../../domain/repositories/tag-repository.interface';
import { CreateTagDto } from '../../dto/tag/create-tag.dto';

@Injectable()
export class CreateTagUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository
    ) { }

    async execute(dto: CreateTagDto) {
        return this.tagRepository.create({
            tagName: dto.tagName
        });
    }
}
