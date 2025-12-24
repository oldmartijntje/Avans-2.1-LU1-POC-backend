import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { AddSubjectDto } from '../../dto/subject/add-subject.dto';
import { GetTagByNameUseCase } from '../tag/get-tag-by-name.use-case';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class CreateSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly getTagByNameUseCase: GetTagByNameUseCase,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(dto: AddSubjectDto, userUuid: string): Promise<Subject> {
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Create, Subject)) {
            throw new UnauthorizedException();
        }

        const newTagsArray: string[] = [];
        for (const tagName of dto.tags) {
            const tag = await this.getTagByNameUseCase.execute(tagName, true);
            if (tag && tag._id) {
                newTagsArray.push(tag._id.toString());
            }
        }

        const description = await this.lookupDisplayTextUseCase.execute(
            dto.descriptionNL,
            dto.descriptionEN,
            true,
            userUuid,
        );
        const title = await this.lookupDisplayTextUseCase.execute(
            dto.titleNL,
            dto.titleEN,
            true,
            userUuid,
        );
        const moreInfo = await this.lookupDisplayTextUseCase.execute(
            dto.moreInfoNL,
            dto.moreInfoEN,
            true,
            userUuid,
        );

        const subject = Subject.create({
            uuid: '',
            titleId: title?.toString() || '',
            descriptionId: description?.toString() || '',
            ownerUuid: userUuid,
            level: dto.level,
            studyPoints: dto.studyPoints,
            moreInfoId: moreInfo?._id?.toString() || '',
            languages: dto.languages,
            tagIds: newTagsArray,
        });

        return await this.subjectRepository.create(subject);
    }
}
