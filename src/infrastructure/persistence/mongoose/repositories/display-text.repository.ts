import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IDisplayTextRepository } from '../../../../domain/repositories/display-text-repository.interface';
import { DisplayText as DisplayTextEntity } from '../../../../domain/entities/display-text.entity';
import { DisplayText as DisplayTextModel } from '../models/display-text.model';
import { DisplayTextMapper } from '../mappers/display-text.mapper';

@Injectable()
export class DisplayTextRepository implements IDisplayTextRepository {
    constructor(
        @InjectModel(DisplayTextModel.name)
        private readonly displayTextModel: Model<DisplayTextModel>
    ) { }

    async findAll(): Promise<DisplayTextEntity[]> {
        const models = await this.displayTextModel.find().exec();
        return models.map(model => DisplayTextMapper.toDomain(model));
    }

    async findById(id: string): Promise<DisplayTextEntity | null> {
        const model = await this.displayTextModel.findById(id).exec();
        return model ? DisplayTextMapper.toDomain(model) : null;
    }

    async findByUiKey(uiKey: string): Promise<DisplayTextEntity | null> {
        const model = await this.displayTextModel.findOne({ uiKey }).exec();
        return model ? DisplayTextMapper.toDomain(model) : null;
    }

    async findByUiKeys(uiKeys: string[]): Promise<DisplayTextEntity[]> {
        const models = await this.displayTextModel.find({ uiKey: { $in: uiKeys } }).exec();
        return models.map(model => DisplayTextMapper.toDomain(model));
    }

    async create(displayText: Omit<DisplayTextEntity, 'id'>): Promise<DisplayTextEntity> {
        const persistenceData = DisplayTextMapper.toPersistence(displayText);
        const createdModel = new this.displayTextModel(persistenceData);
        const savedModel = await createdModel.save();
        return DisplayTextMapper.toDomain(savedModel);
    }

    async update(id: string, updates: Partial<Omit<DisplayTextEntity, 'id'>>): Promise<DisplayTextEntity | null> {
        const updatedModel = await this.displayTextModel
            .findByIdAndUpdate(id, updates, { new: true })
            .exec();
        return updatedModel ? DisplayTextMapper.toDomain(updatedModel) : null;
    }

    async massUpdate(updates: Array<{ id: string; updates: Partial<Omit<DisplayTextEntity, 'id'>> }>): Promise<DisplayTextEntity[]> {
        const bulkOps = updates.map(({ id, updates: updateData }) => ({
            updateOne: {
                filter: { _id: new Types.ObjectId(id) },
                update: { $set: updateData }
            }
        }));

        await this.displayTextModel.bulkWrite(bulkOps);

        const ids = updates.map(u => u.id);
        const updatedModels = await this.displayTextModel.find({ _id: { $in: ids } }).exec();
        return updatedModels.map(model => DisplayTextMapper.toDomain(model));
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.displayTextModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

    async findUnused(): Promise<DisplayTextEntity[]> {
        const models = await this.displayTextModel.find({ uiKey: { $exists: false } }).exec();
        return models.map(model => DisplayTextMapper.toDomain(model));
    }

    async deleteDuplicates(): Promise<void> {
        const duplicates = await this.displayTextModel.aggregate([
            {
                $match: {
                    uiKey: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$uiKey',
                    count: { $sum: 1 },
                    ids: { $push: '$_id' }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]).exec();

        for (const duplicate of duplicates) {
            const documents = await this.displayTextModel.find({
                _id: { $in: duplicate.ids }
            }).sort({ _id: 1 }).exec();

            const toDelete = documents.slice(1);
            const idsToDelete = toDelete.map(doc => doc._id);

            if (idsToDelete.length > 0) {
                await this.displayTextModel.deleteMany({
                    _id: { $in: idsToDelete }
                }).exec();
            }
        }
    }
}
