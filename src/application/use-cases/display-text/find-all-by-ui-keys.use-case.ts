import { Inject, Injectable } from '@nestjs/common';

import { DISPLAY_TEXT_REPOSITORY } from '../../../domain/repositories/display-text-repository.interface';
import type { IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';

export interface FindAllByUiKeysDto {
    uiKeys: string[];
}

export interface DisplayTextResponse {
    uiKey?: string;
    dutch?: string;
    english?: string;
    notFound?: boolean;
    _id?: any;
    creatorUuid?: string;
}

@Injectable()
export class FindAllByUiKeysUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(dto: FindAllByUiKeysDto, isAdmin: boolean, userUuid: string): Promise<DisplayTextResponse[]> {
        const { uiKeys } = dto;

        return Promise.all(
            uiKeys.map(async (uiKey) => {
                const displayText = await this.displayTextRepository.findByUiKey(uiKey);
                if (!displayText) {
                    if (isAdmin) {
                        // Create new display text for admin
                        const created = await this.displayTextRepository.create({
                            dutch: uiKey + " (nieuw)",
                            english: uiKey + " (new)",
                            uiKey: uiKey,
                            creatorUuid: userUuid
                        });
                        return created;
                    }
                    return {
                        uiKey: uiKey,
                        notFound: true
                    } as DisplayTextResponse;
                }
                return displayText;
            })
        );
    }
}
