import { Inject, Injectable } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { TagService } from '../../../tag/tag.service';

@Injectable()
export class ListSubjectsUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly tagService: TagService,
    ) { }

    async execute(
        level?: 'NLQF-5' | 'NLQF-6',
        pointsFilter?: number,
        tag?: string,
    ): Promise<Subject[]> {
        const filters: any = {};

        if (level) {
            filters.level = level;
        }

        if (pointsFilter) {
            filters.pointsFilter = pointsFilter;
        }

        if (tag) {
            const tagDocument = await this.tagService.lookupByName(tag, false);
            if (tagDocument) {
                filters.tagId = tagDocument._id.toString();
            } else {
                return [];
            }
        }

        return await this.subjectRepository.findAll(filters);
    }
}
