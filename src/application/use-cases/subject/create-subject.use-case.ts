import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { AddSubjectDto } from '../../dto/subject/add-subject.dto';
import { TagService } from '../../../tag/tag.service';
import { DisplayTextService } from '../../../display-text/display-text.service';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { Subject as SubjectSchema } from '../../../subjects/schemas/subject.schema';

@Injectable()
export class CreateSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly tagService: TagService,
        private readonly displayTextService: DisplayTextService,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(dto: AddSubjectDto, userUuid: string): Promise<Subject> {
        // Authorization check
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Create, SubjectSchema)) {
            throw new UnauthorizedException();
        }

        // Process tags
        const newTagsArray: Types.ObjectId[] = [];
        for (const tagName of dto.tags) {
            const tag = await this.tagService.lookupByName(tagName, true);
            if (tag) {
                newTagsArray.push(tag);
            }
        }

        // Create display texts
        const description = await this.displayTextService.lookupByTranslations(
            dto.descriptionNL,
            dto.descriptionEN,
            true,
            userUuid,
        );
        const title = await this.displayTextService.lookupByTranslations(
            dto.titleNL,
            dto.titleEN,
            true,
            userUuid,
        );
        const moreInfo = await this.displayTextService.lookupByTranslations(
            dto.moreInfoNL,
            dto.moreInfoEN,
            true,
            userUuid,
        );

        const subject = Subject.create({
            uuid: '', // Will be generated in repository
            titleId: title?.toString() || '',
            descriptionId: description?.toString() || '',
            ownerUuid: userUuid,
            level: dto.level,
            studyPoints: dto.studyPoints,
            moreInfoId: moreInfo?.toString() || '',
            languages: dto.languages,
            tagIds: newTagsArray.map((t) => t.toString()),
        });

        return await this.subjectRepository.create(subject);
    }
}
