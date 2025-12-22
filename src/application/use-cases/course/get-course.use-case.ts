import { Inject, Injectable } from '@nestjs/common';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';

@Injectable()
export class GetCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(uuid: string): Promise<Course> {
        return await this.courseRepository.findById(uuid, true);
    }
}
