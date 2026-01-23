import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import type { ISubjectRepository } from '../../../../domain/repositories/subject-repository.interface';
import { Subject as SubjectEntity } from '../../../../domain/entities/subject.entity';
import { Subject as SubjectModel } from '../models/subject.model';
import { SubjectMapper } from '../mappers/subject.mapper';

@Injectable()
export class SubjectRepository implements ISubjectRepository {
    constructor(
        @InjectModel(SubjectModel.name)
        private readonly subjectModel: Model<SubjectModel>,
    ) { }

    async findAll(filters?: {
        level?: 'NLQF-5' | 'NLQF-6';
        pointsFilter?: number;
        tagId?: string;
    }): Promise<any[]> {
        const query: any = {};

        if (filters?.level) {
            query.level = filters.level;
        }

        if (filters?.pointsFilter) {
            query.studyPoints = { $gte: filters.pointsFilter };
        }

        if (filters?.tagId) {
            query.tags = { $in: [filters.tagId] };
        }

        // Return raw Mongoose documents to preserve _id and __v
        return await this.subjectModel
            .find(query)
            .populate('description')
            .populate('title')
            .populate('moreInfo')
            .exec();
    }

    async findById(uuid: string, populate: boolean): Promise<any> {
        let model;
        if (populate) {
            model = await this.subjectModel
                .findOne({ uuid })
                .populate('description')
                .populate('title')
                .populate('moreInfo')
                .exec();
        } else {
            model = await this.subjectModel.findOne({ uuid }).exec();
        }

        if (!model) {
            throw new NotFoundException('Subject Not Found');
        }

        // Return raw Mongoose document to preserve _id and __v
        return model;
    }

    async findAllDisplayTextReferences(): Promise<Array<{ title: string; description: string; moreInfo: string }>> {
        return await this.subjectModel
            .find({}, { title: 1, description: 1, moreInfo: 1 })
            .exec()
            .then(docs => docs.map(doc => ({
                title: doc.title?.toString() || '',
                description: doc.description?.toString() || '',
                moreInfo: doc.moreInfo?.toString() || ''
            })));
    }

    async create(subject: SubjectEntity): Promise<any> {
        const persistenceData = SubjectMapper.toPersistence(subject);
        const newSubject = new this.subjectModel({
            ...persistenceData,
            uuid: uuidv4(),
        });

        const saved = await newSubject.save();
        const populated = await saved.populate('description');
        await populated.populate('title');
        await populated.populate('moreInfo');
        await populated.populate('tags');

        // Return raw Mongoose document to preserve _id and __v
        return populated;
    }

    async update(
        uuid: string,
        data: Partial<SubjectEntity>,
    ): Promise<any> {
        const existing = await this.subjectModel.findOne({ uuid }).exec();
        if (!existing) {
            throw new NotFoundException('Subject Not Found');
        }

        const updateData: any = {};
        if (data.titleId !== undefined) updateData.title = data.titleId;
        if (data.descriptionId !== undefined)
            updateData.description = data.descriptionId;
        if (data.level) updateData.level = data.level;
        if (data.studyPoints !== undefined)
            updateData.studyPoints = data.studyPoints;
        if (data.moreInfoId !== undefined) updateData.moreInfo = data.moreInfoId;
        if (data.languages) updateData.languages = data.languages;
        if (data.tags) updateData.tags = data.tags;
        if (data.isFavourite !== undefined)
            updateData.isFavourite = data.isFavourite;

        const updated = await this.subjectModel
            .findOneAndUpdate({ uuid }, updateData, { new: true })
            .populate('description')
            .populate('title')
            .populate('moreInfo')
            .exec();

        if (!updated) {
            throw new NotFoundException('Subject Not Found');
        }

        // Return raw Mongoose document to preserve _id and __v
        return updated;
    }

    async delete(uuid: string): Promise<any> {
        const result = await this.subjectModel.deleteOne({ uuid }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Subject Not Found');
        }
        // Return proper message object instead of boolean
        return { message: 'Subject deleted successfully' };
    }

    async findByIds(ids: string[]): Promise<any[]> {
        // Convert string IDs to ObjectIds and query
        return await this.subjectModel
            .find({ _id: { $in: ids } })
            .populate('description')
            .populate('title')
            .populate('moreInfo')
            .exec();
    }

    async findByUuid(uuid: string): Promise<any> {
        return await this.subjectModel.findOne({ uuid }).exec();
    }

    async findByTagIds(tagIds: string[]): Promise<any[]> {
        return await this.subjectModel
            .find({ tags: { $in: tagIds } })
            .populate('description')
            .populate('title')
            .populate('moreInfo')
            .exec();
    }
}
