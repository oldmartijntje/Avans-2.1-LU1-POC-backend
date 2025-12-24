import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TAG_REPOSITORY, type ITagRepository } from '../../../../domain/repositories/tag-repository.interface';
import { Tag as TagEntity } from '../../../../domain/entities/tag.entity';
import { Tag as TagModel } from '../models/tag.model';
import { TagMapper } from '../mappers/tag.mapper';

@Injectable()
export class TagRepository implements ITagRepository {
    constructor(
        @InjectModel(TagModel.name)
        private readonly tagModel: Model<TagModel>
    ) { }

    async findAll(): Promise<any[]> {
        // Return raw Mongoose documents to preserve _id and __v fields for API compatibility
        return await this.tagModel.find().exec();
    }

    async findById(id: string): Promise<TagEntity | null> {
        const model = await this.tagModel.findById(id).exec();
        return model ? TagMapper.toDomain(model) : null;
    }

    async findByName(tagName: string): Promise<any | null> {
        // Return raw Mongoose document to preserve _id and __v fields for API compatibility
        const model = await this.tagModel.findOne({ tagName }).exec();
        return model;
    }

    async create(tag: Omit<TagEntity, 'id'>): Promise<any> {
        const persistenceData = TagMapper.toPersistence(tag);
        const createdModel = new this.tagModel(persistenceData);
        const savedModel = await createdModel.save();
        // Return raw Mongoose document to preserve _id and __v fields for API compatibility
        return savedModel;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.tagModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
