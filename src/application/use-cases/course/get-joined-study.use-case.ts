import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';

@Injectable()
export class GetJoinedStudyUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(userUuid: string): Promise<any[]> {
        // Get user - returns domain entity with studyId
        const user = await this.userRepository.findById(userUuid);
        if (!user || !user.studyId) {
            return [];
        }

        // Get the course with full population
        const course = await this.courseRepository.findById(user.studyId, true);
        if (!course) {
            return [];
        }

        // Return as array for API compatibility
        return [course];
    }
}
