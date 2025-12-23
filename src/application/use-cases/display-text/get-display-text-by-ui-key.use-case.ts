import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class GetDisplayTextByUiKeyUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) {}

    async execute(uiKey: string, createIfNotFound: boolean, creatorUuid: string) {
        let displayText = await this.displayTextRepository.findByUiKey(uiKey);
        
        if (!displayText && createIfNotFound) {
            displayText = await this.displayTextRepository.create({
                dutch: uiKey + " (nieuw)",
                english: uiKey + " (new)",
                creatorUuid,
                uiKey
            });
        }
        
        if (!displayText) {
            throw new NotFoundException(`DisplayText with uiKey ${uiKey} not found`);
        }
        
        return displayText;
    }
}
