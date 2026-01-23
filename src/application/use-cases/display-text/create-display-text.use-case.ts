import { Injectable, Inject } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { CreateDisplayTextDto } from '../../dto/display-text/create-display-text.dto';

@Injectable()
export class CreateDisplayTextUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) { }

    async execute(dto: CreateDisplayTextDto) {
        return this.displayTextRepository.create({
            dutch: dto.dutch,
            english: dto.english,
            // creatorUuid removed
            uiKey: dto.uiKey
        });
    }
}
