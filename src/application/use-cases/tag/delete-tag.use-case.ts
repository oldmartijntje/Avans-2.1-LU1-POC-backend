import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TAG_REPOSITORY, type ITagRepository } from '../../../domain/repositories/tag-repository.interface';

@Injectable()
export class DeleteTagUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository
    ) { }

    async execute(id: string) {
        const deleted = await this.tagRepository.delete(id);
        if (!deleted) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }
        return { success: true, message: 'Tag deleted successfully' };
    }
}
