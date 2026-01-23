import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';

@Injectable()
export class GetRecommendedSubjectsUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(userUuid: string): Promise<any[]> {
        const user = await this.userRepository.findById(userUuid);
        if (!user || !user.studyId) {
            throw new BadRequestException('User or user study not found');
        }

        const study = await this.courseRepository.findById(user.studyId, true);
        if (!study || !study.tags || study.tags.length === 0) {
            return [];
        }

        const studyTagNames = study.tags;

        const subjects = await this.subjectRepository.findByTagIds(studyTagNames);

        const favouriteIds = await this.userRepository.getFavouriteIds(userUuid);

        return subjects.map(subject => {
            const subjectObj = subject.toObject();

            const isFavourite = favouriteIds.includes(subjectObj._id.toString());

            const subjectTagNames = subjectObj.tags;
            const matchingTags = subjectTagNames.filter(tagName => studyTagNames.includes(tagName));
            const matchPercentage = (matchingTags.length / studyTagNames.length) * 100;

            return {
                ...subjectObj,
                isFavourite,
                matchPercentage: Math.round(matchPercentage * 100) / 100,
            };
        });
    }
}
