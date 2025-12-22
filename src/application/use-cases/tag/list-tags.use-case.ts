import { Injectable, Inject } from '@nestjs/common';
import { TAG_REPOSITORY, type ITagRepository } from '../../../domain/repositories/tag-repository.interface';

@Injectable()
export class ListTagsUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository
    ) { }

    async execute() {
        return this.tagRepository.findAll();
    }
}
