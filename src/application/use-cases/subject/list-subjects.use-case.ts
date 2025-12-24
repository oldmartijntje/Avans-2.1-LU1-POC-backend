import { Inject, Injectable } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { TAG_REPOSITORY, type ITagRepository } from '../../../domain/repositories/tag-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';

@Injectable()
export class ListSubjectsUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: ITagRepository,
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
            const tagDocument = await this.tagRepository.findByName(tag);
            if (tagDocument && tagDocument._id) {
                filters.tagId = tagDocument._id.toString();
            } else {
                return [];
            }
        }

        return await this.subjectRepository.findAll(filters);
    }
}
