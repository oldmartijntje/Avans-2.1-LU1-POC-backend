import { Injectable, Inject } from '@nestjs/common';
import { TAG_REPOSITORY, type ITagRepository } from '../../../domain/repositories/tag-repository.interface';

@Injectable()
export class GetTagByNameUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository
    ) { }

    async execute(tagName: string, createIfNotFound: boolean) {
        let tag = await this.tagRepository.findByName(tagName);

        if (!tag && createIfNotFound) {
            tag = await this.tagRepository.create({ tagName });
        }

        return tag;
    }
}
