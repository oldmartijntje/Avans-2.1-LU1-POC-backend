import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { UpdateSubjectDto } from '../../dto/subject/update-subject.dto';
import { GetTagByNameUseCase } from '../tag/get-tag-by-name.use-case';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class UpdateSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly getTagByNameUseCase: GetTagByNameUseCase,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(
        uuid: string,
        dto: UpdateSubjectDto,
        userUuid: string,
    ): Promise<Subject> {
        // Get existing subject for authorization
        const existingSubject = await this.subjectRepository.findById(uuid, true);

        // Authorization check
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Update, existingSubject)) {
            throw new UnauthorizedException();
        }

        // Process tags if provided
        let newTagsArray: string[] | undefined;
        if (dto.tags) {
            newTagsArray = [];
            for (const tagName of dto.tags) {
                const tag = await this.getTagByNameUseCase.execute(tagName, true);
                if (tag && tag._id) {
                    newTagsArray.push(tag._id.toString());
                }
            }
        }

        // Get existing display text data
        const description = existingSubject.description as any;
        const title = existingSubject.title as any;
        const moreInfo = existingSubject.moreInfo as any;

        const descriptionNL = dto.descriptionNL || description?.nl;
        const descriptionEN = dto.descriptionEN || description?.en;
        const titleNL = dto.titleNL || title?.nl;
        const titleEN = dto.titleEN || title?.en;
        const moreInfoNL = dto.moreInfoNL || moreInfo?.nl;
        const moreInfoEN = dto.moreInfoEN || moreInfo?.en;

        // Update display texts
        const updatedDescription =
            await this.lookupDisplayTextUseCase.execute(
                descriptionNL,
                descriptionEN,
                true,
                userUuid,
            );
        const updatedTitle = await this.lookupDisplayTextUseCase.execute(
            titleNL,
            titleEN,
            true,
            userUuid,
        );
        const updatedMoreInfo = await this.lookupDisplayTextUseCase.execute(
            moreInfoNL,
            moreInfoEN,
            true,
            userUuid,
        );

        const updates: Partial<Subject> = {};
        if (updatedTitle) updates.titleId = updatedTitle._id?.toString() || '';
        if (updatedDescription)
            updates.descriptionId = updatedDescription._id?.toString() || '';
        if (updatedMoreInfo) updates.moreInfoId = updatedMoreInfo._id?.toString() || '';
        if (dto.level) updates.level = dto.level;
        if (dto.studyPoints !== undefined) updates.studyPoints = dto.studyPoints;
        if (dto.languages) updates.languages = dto.languages;
        if (newTagsArray) updates.tagIds = newTagsArray;

        return await this.subjectRepository.update(uuid, updates);
    }
}
