import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, model, Schema } from 'mongoose';
import { Subject, SubjectDocument } from '../subjects/schemas/subject.schema';
import { Course, CourseDocument } from '../course/schema/course.schema';

// This is a sample tag interface, adjust as needed
type OldTag = {
    _id: any;
    tagName: string;
    color?: string;
};

@Injectable()
export class TagMigrationService implements OnModuleInit {
    constructor(
        @InjectModel('Subject') private subjectModel: Model<SubjectDocument>,
        @InjectModel('Course') private courseModel: Model<CourseDocument>,
    ) { }

    async onModuleInit() {
        await this.migrateTags();
    }

    async migrateTags() {
        // All tag collection logic removed. Implement migration for string arrays only if needed.
    }
}
