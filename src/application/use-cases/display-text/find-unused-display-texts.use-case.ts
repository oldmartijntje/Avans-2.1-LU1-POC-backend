import { Injectable, Inject } from '@nestjs/common';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { SUBJECT_REPOSITORY, type ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { COURSE_REPOSITORY, type ICourseRepository } from '../../../domain/repositories/course-repository.interface';

@Injectable()
export class FindUnusedDisplayTextsUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository,
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute() {
        // Get all display texts without uiKey
        const items = await this.displayTextRepository.findUnused();

        // Get all subjects and courses to check for references
        const subjects = await this.subjectRepository.findAllDisplayTextReferences();
        const courses = await this.courseRepository.findAllDisplayTextReferences();

        const usedIds = new Set();

        // Check subjects for title, description, and moreInfo references
        for (const subject of subjects) {
            const text = `${subject.title} ${subject.description} ${subject.moreInfo}`;
            for (const item of items) {
                if (text.includes(item._id.toString())) {
                    usedIds.add(item._id.toString());
                }
            }
        }

        // Check courses for title and description references
        for (const course of courses) {
            const text = `${course.title} ${course.description}`;
            for (const item of items) {
                if (text.includes(item._id.toString())) {
                    usedIds.add(item._id.toString());
                }
            }
        }

        // Return only truly unused items
        return items.filter(item => !usedIds.has(item._id.toString()));
    }
}
