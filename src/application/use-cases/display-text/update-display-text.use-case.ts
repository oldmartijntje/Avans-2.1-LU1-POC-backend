import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { UpdateDisplayTextDto } from '../../dto/display-text/update-display-text.dto';

@Injectable()
export class UpdateDisplayTextUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) {}

    async execute(id: string, dto: UpdateDisplayTextDto) {
        const updated = await this.displayTextRepository.update(id, dto);
        if (!updated) {
            throw new NotFoundException(`DisplayText with ID ${id} not found`);
        }
        return updated;
    }
}
