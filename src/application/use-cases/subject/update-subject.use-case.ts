import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { UpdateSubjectDto } from '../../dto/subject/update-subject.dto';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class UpdateSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(
        uuid: string,
        dto: UpdateSubjectDto,
        userUuid: string,
    ): Promise<Subject> {
        const existingSubject = await this.subjectRepository.findById(uuid, true);

        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Update, existingSubject)) {
            throw new UnauthorizedException();
        }

        let newTagsArray: string[] | undefined;
        if (dto.tags) {
            newTagsArray = dto.tags;
        }

        const updates: Partial<Subject> = {};
        // Merge translation fields if partial update
        if (dto.title) {
            updates.title = {
                dutch: dto.title.dutch ?? existingSubject.title.dutch,
                english: dto.title.english ?? existingSubject.title.english,
            };
        }
        if (dto.description) {
            updates.description = {
                dutch: dto.description.dutch ?? existingSubject.description.dutch,
                english: dto.description.english ?? existingSubject.description.english,
            };
        }
        if (dto.moreInfo) {
            updates.moreInfo = {
                dutch: dto.moreInfo.dutch ?? existingSubject.moreInfo?.dutch,
                english: dto.moreInfo.english ?? existingSubject.moreInfo?.english,
            };
        }
        if (dto.level) updates.level = dto.level;
        if (dto.studyPoints !== undefined) updates.studyPoints = dto.studyPoints;
        if (dto.languages) updates.languages = dto.languages;
        if (newTagsArray) updates.tags = newTagsArray;

        return await this.subjectRepository.update(uuid, updates);
    }
}
