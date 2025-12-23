import { Injectable, Inject } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class DeleteDuplicatesUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) {}

    async execute() {
        await this.displayTextRepository.deleteDuplicates();
        return { success: true, message: 'Duplicates deleted successfully' };
    }
}
