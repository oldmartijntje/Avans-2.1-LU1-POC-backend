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
        // Get user - returns domain entity with studyId
        const user = await this.userRepository.findById(userUuid);
        if (!user || !user.studyId) {
            throw new BadRequestException('User or user study not found');
        }

        // Get the study course with tags populated
        const study = await this.courseRepository.findById(user.studyId, true);
        if (!study || !study.tags || study.tags.length === 0) {
            return [];
        }

        // Extract tag IDs from the study
        const studyTagIds = study.tags.map((tag: any) =>
            tag._id ? tag._id.toString() : tag.toString()
        );

        // Find subjects that have any of these tags
        const subjects = await this.subjectRepository.findByTagIds(studyTagIds);

        // Get user's favourite IDs
        const favouriteIds = await this.userRepository.getFavouriteIds(userUuid);

        // Process subjects to add isFavourite and matchPercentage
        return subjects.map(subject => {
            const subjectObj = subject.toObject();

            // Check if subject is in favourites
            const isFavourite = favouriteIds.includes(subjectObj._id.toString());

            // Calculate match percentage
            const subjectTagIds = subjectObj.tags.map((tag: any) =>
                tag._id ? tag._id.toString() : tag.toString()
            );
            const matchingTags = subjectTagIds.filter(tagId => studyTagIds.includes(tagId));
            const matchPercentage = (matchingTags.length / studyTagIds.length) * 100;

            return {
                ...subjectObj,
                isFavourite,
                matchPercentage: Math.round(matchPercentage * 100) / 100, // Round to 2 decimal places
            };
        });
    }
}
