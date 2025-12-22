import { Injectable, Inject } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';

@Injectable()
export class FindUnusedDisplayTextsUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository
    ) {}

    async execute() {
        return this.displayTextRepository.findUnused();
    }
}
