import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { UpdateSubjectDto } from '../../dto/subject/update-subject.dto';
import { TagService } from '../../../tag/tag.service';
import { DisplayTextService } from '../../../display-text/display-text.service';
import { UsersService } from '../../../users/users.service';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { SubjectsService } from '../../../subjects/subjects.service';

@Injectable()
export class UpdateSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly tagService: TagService,
        private readonly displayTextService: DisplayTextService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly subjectsService: SubjectsService,
    ) { }

    async execute(
        uuid: string,
        dto: UpdateSubjectDto,
        userUuid: string,
    ): Promise<Subject> {
        // Get existing subject for authorization
        const existingSubject = await this.subjectsService.findByUuid(uuid, true);

        // Authorization check
        const user = await this.usersService.findOne(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Update, existingSubject)) {
            throw new UnauthorizedException();
        }

        // Process tags if provided
        let newTagsArray: Types.ObjectId[] | undefined;
        if (dto.tags) {
            newTagsArray = [];
            for (const tagName of dto.tags) {
                const tag = await this.tagService.lookupByName(tagName, true);
                if (tag) {
                    newTagsArray.push(tag);
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
            await this.displayTextService.lookupByTranslations(
                descriptionNL,
                descriptionEN,
                true,
                userUuid,
            );
        const updatedTitle = await this.displayTextService.lookupByTranslations(
            titleNL,
            titleEN,
            true,
            userUuid,
        );
        const updatedMoreInfo = await this.displayTextService.lookupByTranslations(
            moreInfoNL,
            moreInfoEN,
            true,
            userUuid,
        );

        const updates: Partial<Subject> = {};
        if (updatedTitle) updates.titleId = updatedTitle.toString();
        if (updatedDescription)
            updates.descriptionId = updatedDescription.toString();
        if (updatedMoreInfo) updates.moreInfoId = updatedMoreInfo.toString();
        if (dto.level) updates.level = dto.level;
        if (dto.studyPoints !== undefined) updates.studyPoints = dto.studyPoints;
        if (dto.languages) updates.languages = dto.languages;
        if (newTagsArray) updates.tagIds = newTagsArray.map((t) => t.toString());

        return await this.subjectRepository.update(uuid, updates);
    }
}
