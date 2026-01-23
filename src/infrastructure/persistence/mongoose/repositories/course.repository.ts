import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import type { ICourseRepository } from '../../../../domain/repositories/course-repository.interface';
import { Course as CourseEntity } from '../../../../domain/entities/course.entity';
import { Course as CourseModel } from '../models/course.model';
import { CourseMapper } from '../mappers/course.mapper';

@Injectable()
export class CourseRepository implements ICourseRepository {
    constructor(
        @InjectModel(CourseModel.name)
        private readonly courseModel: Model<CourseModel>,
    ) { }

    async findAll(): Promise<any[]> {
        // Return raw populated Mongoose documents to preserve _id, __v and nested objects
        return await this.courseModel
            .find()
            .populate('description')
            .populate('title')
            .exec();
    }

    async findById(uuid: string, populate: boolean): Promise<any> {
        let model;
        if (populate) {
            model = await this.courseModel
                .findOne({ uuid })
                .populate('description')
                .populate('title')
                .exec();
        } else {
            model = await this.courseModel.findOne({ uuid }).exec();
        }

        if (!model) {
            throw new NotFoundException('Course Not Found');
        }

        return model;
    }

    async findAllDisplayTextReferences(): Promise<Array<{ title: string; description: string }>> {
        return await this.courseModel
            .find({}, { title: 1, description: 1 })
            .exec()
            .then(docs => docs.map(doc => ({
                title: doc.title?.toString() || '',
                description: doc.description?.toString() || ''
            })));
    }

    async create(course: CourseEntity): Promise<any> {
        const persistenceData = CourseMapper.toPersistence(course);
        const newCourse = new this.courseModel({
            ...persistenceData,
            uuid: uuidv4(),
        });

        const saved = await newCourse.save();
        const populated = await saved.populate('description');
        await populated.populate('title');
        // tags are now strings, no need to populate

        // Return raw Mongoose document to preserve _id and __v
        return populated;
    }

    async update(uuid: string, data: Partial<CourseEntity>): Promise<any> {
        const existing = await this.courseModel.findOne({ uuid }).exec();
        if (!existing) {
            throw new NotFoundException('Course Not Found');
        }

        const updateData: any = {};
        if (data.titleId !== undefined) updateData.title = data.titleId;
        if (data.descriptionId !== undefined)
            updateData.description = data.descriptionId;
        if (data.languages) updateData.languages = data.languages;
        if (data.tags) updateData.tags = data.tags;

        const updated = await this.courseModel
            .findOneAndUpdate({ uuid }, updateData, { new: true })
            .populate('description')
            .populate('title')
            .exec();

        if (!updated) {
            throw new NotFoundException('Course Not Found');
        }

        // Return raw Mongoose document
        return updated;
    }

    async delete(uuid: string): Promise<any> {
        const result = await this.courseModel.deleteOne({ uuid }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Course Not Found');
        }
        // Return proper message object instead of boolean
        return { message: 'Subject deleted successfully' };
    }
}
