import { Inject, Injectable } from '@nestjs/common';

import { DISPLAY_TEXT_REPOSITORY } from '../../../domain/repositories/display-text-repository.interface';
import type { IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class FindUiElementsUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository,
    ) { }

    async execute(): Promise<any[]> {
        // Find all display texts that have a uiKey (UI elements)
        const allDisplayTexts = await this.displayTextRepository.findAll();
        // Filter to only those with uiKey
        return allDisplayTexts.filter(dt => dt.uiKey !== undefined && dt.uiKey !== null);
    }
}
