import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { DISPLAY_TEXT_REPOSITORY } from '../../../domain/repositories/display-text-repository.interface';
import type { IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { DisplayText } from '../../../domain/entities/display-text.entity';

@Injectable()
export class DeleteUnusedUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository,
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(userUuid: string): Promise<{ deletedCount: number; message: string }> {
        const domainUser = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(domainUser);
        if (!ability.can(CaslAction.Delete, DisplayText)) {
            throw new UnauthorizedException();
        }

        const subjectRefs = await this.subjectRepository.findAllDisplayTextReferences();
        const courseRefs = await this.courseRepository.findAllDisplayTextReferences();

        const usedIds = new Set<string>();
        for (const ref of subjectRefs) {
            if (ref.title) usedIds.add(ref.title);
            if (ref.description) usedIds.add(ref.description);
            if (ref.moreInfo) usedIds.add(ref.moreInfo);
        }
        for (const ref of courseRefs) {
            if (ref.title) usedIds.add(ref.title);
            if (ref.description) usedIds.add(ref.description);
        }

        const allDisplayTexts = await this.displayTextRepository.findAll();
        const unused = allDisplayTexts.filter(dt => {
            if (!dt._id && !dt.id) return false;
            const id = (dt._id || dt.id).toString();
            return !usedIds.has(id);
        });

        const unusedIds = unused.map(item => item._id || item.id);
        if (unusedIds.length === 0) {
            return { deletedCount: 0, message: 'No unused display texts found.' };
        }

        let deletedCount = 0;
        for (const id of unusedIds) {
            try {
                await this.displayTextRepository.delete(id);
                deletedCount++;
            } catch (error) {
                // Continue deleting others even if one fails
            }
        }

        return {
            deletedCount,
            message: `Deleted ${deletedCount} unused display texts.`,
        };
    }
}
