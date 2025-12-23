import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class GetDisplayTextUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) {}

    async execute(id: string) {
        const displayText = await this.displayTextRepository.findById(id);
        if (!displayText) {
            throw new NotFoundException(`DisplayText with ID ${id} not found`);
        }
        return displayText;
    }
}
