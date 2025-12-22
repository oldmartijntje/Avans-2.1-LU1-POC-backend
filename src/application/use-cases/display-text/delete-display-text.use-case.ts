import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class DeleteDisplayTextUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) {}

    async execute(id: string) {
        const deleted = await this.displayTextRepository.delete(id);
        if (!deleted) {
            throw new NotFoundException(`DisplayText with ID ${id} not found`);
        }
        return { success: true, message: 'DisplayText deleted successfully' };
    }
}
