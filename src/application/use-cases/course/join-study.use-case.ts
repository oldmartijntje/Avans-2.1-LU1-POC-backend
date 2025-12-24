import { Inject, Injectable } from '@nestjs/common';

import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';

@Injectable()
export class JoinStudyUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userUuid: string, studyUuid: string): Promise<any> {
        // Get the course to verify it exists and get its _id
        const course = await this.courseRepository.findById(studyUuid, false);
        if (!course) {
            throw new Error('Course not found');
        }

        // Update user's study field with the course _id
        return await this.userRepository.update(userUuid, { studyId: course._id.toString() });
    }
}
