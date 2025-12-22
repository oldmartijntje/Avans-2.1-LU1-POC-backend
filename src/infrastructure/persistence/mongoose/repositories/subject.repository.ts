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
	) {}

	async findAll(filters?: {
		level?: 'NLQF-5' | 'NLQF-6';
		pointsFilter?: number;
		tagId?: string;
	}): Promise<SubjectEntity[]> {
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

		const models = await this.subjectModel
			.find(query)
			.populate('description')
			.populate('title')
			.populate('moreInfo')
			.populate('tags')
			.exec();

		return SubjectMapper.toDomainArray(models);
	}

	async findById(uuid: string, populate: boolean): Promise<SubjectEntity> {
		let model;
		if (populate) {
			model = await this.subjectModel
				.findOne({ uuid })
				.populate('description')
				.populate('title')
				.populate('moreInfo')
				.populate('tags')
				.exec();
		} else {
			model = await this.subjectModel.findOne({ uuid }).exec();
		}

		if (!model) {
			throw new NotFoundException('Subject Not Found');
		}

		const subject = SubjectMapper.toDomain(model);
		if (!subject) {
			throw new NotFoundException('Subject Not Found');
		}
		return subject;
	}

	async create(subject: SubjectEntity): Promise<SubjectEntity> {
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

		const savedSubject = SubjectMapper.toDomain(populated);
		if (!savedSubject) {
			throw new Error('Failed to create subject');
		}
		return savedSubject;
	}

	async update(
		uuid: string,
		data: Partial<SubjectEntity>,
	): Promise<SubjectEntity> {
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
		if (data.tagIds) updateData.tags = data.tagIds;
		if (data.isFavourite !== undefined)
			updateData.isFavourite = data.isFavourite;

		const updated = await this.subjectModel
			.findOneAndUpdate({ uuid }, updateData, { new: true })
			.populate('description')
			.populate('title')
			.populate('moreInfo')
			.populate('tags')
			.exec();

		if (!updated) {
			throw new NotFoundException('Subject Not Found');
		}

		const subject = SubjectMapper.toDomain(updated);
		if (!subject) {
			throw new NotFoundException('Subject Not Found');
		}
		return subject;
	}

	async delete(uuid: string): Promise<boolean> {
		const result = await this.subjectModel.deleteOne({ uuid }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Subject Not Found');
		}
		return true;
	}
}
