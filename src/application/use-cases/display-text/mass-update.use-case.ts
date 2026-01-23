import { Inject, Injectable } from '@nestjs/common';

import { DISPLAY_TEXT_REPOSITORY } from '../../../domain/repositories/display-text-repository.interface';
import type { IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

export interface MassUpdateItem {
    uiKey: string;
    english: string;
    dutch: string;
}

export interface MassUpdateDto {
    uiKeys: MassUpdateItem[];
}

@Injectable()
export class MassUpdateUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(dto: MassUpdateDto, userUuid: string): Promise<any> {
        const { uiKeys } = dto;
        const results: any[] = [];
        const errors: any[] = [];

        const domainUser = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(domainUser);

        for (const item of uiKeys) {
            try {
                let displayText = await this.displayTextRepository.findByUiKey(item.uiKey);
                let isCreating = false;

                if (!displayText) {
                    if (!ability.can(CaslAction.Create, {} as any)) {
                        errors.push({
                            uiKey: item.uiKey,
                            error: 'Unauthorized to create this display text.'
                        });
                        continue;
                    }

                    displayText = await this.displayTextRepository.create({
                        uiKey: item.uiKey,
                        english: item.english,
                        dutch: item.dutch,
                        // creatorUuid removed
                    });
                    isCreating = true;
                } else {
                    if (!ability.can(CaslAction.Update, displayText)) {
                        errors.push({
                            uiKey: item.uiKey,
                            error: 'Unauthorized to update this display text.'
                        });
                        continue;
                    }

                    displayText = await this.displayTextRepository.update(displayText.id || displayText._id?.toString(), {
                        english: item.english,
                        dutch: item.dutch
                    });
                }

                results.push({
                    uiKey: item.uiKey,
                    success: true,
                    created: isCreating,
                    data: displayText
                });

            } catch (error) {
                errors.push({
                    uiKey: item.uiKey,
                    error: error.message || 'Unknown error occurred'
                });
            }
        }

        return {
            successful: results.length,
            failed: errors.length,
            results,
            errors
        };
    }
}
