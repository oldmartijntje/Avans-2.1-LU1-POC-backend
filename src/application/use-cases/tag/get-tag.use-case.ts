import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TAG_REPOSITORY, type ITagRepository } from '../../../domain/repositories/tag-repository.interface';

@Injectable()
export class GetTagUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository
    ) { }

    async execute(id: string) {
        const tag = await this.tagRepository.findById(id);
        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }
        return tag;
    }
}
