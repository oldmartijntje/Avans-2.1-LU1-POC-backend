import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DISPLAY_TEXT_REPOSITORY, type IDisplayTextRepository } from '../../../domain/repositories/display-text-repository.interface';
import { Subject } from '../../../subjects/schemas/subject.schema';
import { Course } from '../../../course/schema/course.schema';

@Injectable()
export class FindUnusedDisplayTextsUseCase {
    constructor(
        @Inject(DISPLAY_TEXT_REPOSITORY)
        private readonly displayTextRepository: IDisplayTextRepository,
        @InjectModel(Subject.name) private subjectModel: Model<Subject>,
        @InjectModel(Course.name) private courseModel: Model<Course>,
    ) { }

    async execute() {
        // Get all display texts without uiKey
        const items = await this.displayTextRepository.findUnused();

        // Get all subjects and courses to check for references
        const subjects = await this.subjectModel.find({}, { title: 1, description: 1, moreInfo: 1 });
        const courses = await this.courseModel.find({}, { title: 1, description: 1 });

        const usedIds = new Set();

        // Check subjects for title, description, and moreInfo references
        for (const subject of subjects) {
            const text = `${subject.title ?? ''} ${subject.description ?? ''} ${subject.moreInfo ?? ''}`;
            for (const item of items) {
                if (text.includes(item._id.toString())) {
                    usedIds.add(item._id.toString());
                }
            }
        }

        // Check courses for title and description references
        for (const course of courses) {
            const text = `${course.title ?? ''} ${course.description ?? ''}`;
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
