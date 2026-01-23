import { Injectable, Inject } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class LookupDisplayTextByTranslationsUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) { }

    async execute(dutch: string, english: string, createIfNotFound: boolean) {
        let displayText = await this.displayTextRepository.findByTranslations(dutch, english);

        if (!displayText && createIfNotFound) {
            displayText = await this.displayTextRepository.create({
                dutch,
                english,
                // creatorUuid removed
            });
        }

        return displayText;
    }
}
