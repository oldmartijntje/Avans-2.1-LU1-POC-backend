import { Subject as SubjectEntity } from '../../../../domain/entities/subject.entity';
import { Subject as SubjectModel } from '../models/subject.model';

export class SubjectMapper {
	static toDomain(model: any): SubjectEntity | null {
		if (!model) return null;

		return SubjectEntity.create({
			uuid: model.uuid,
			titleId: model.title?.toString() || '',
			descriptionId: model.description?.toString() || '',
			ownerUuid: model.ownerUuid,
			level: model.level,
			studyPoints: model.studyPoints,
			moreInfoId: model.moreInfo?.toString() || '',
			languages: model.languages || [],
			tagIds: model.tags?.map((t) => t.toString()) || [],
			isFavourite: model.isFavourite,
		});
	}

	static toPersistence(entity: SubjectEntity): any {
		return {
			uuid: entity.uuid,
			title: entity.titleId,
			description: entity.descriptionId,
			ownerUuid: entity.ownerUuid,
			level: entity.level,
			studyPoints: entity.studyPoints,
			moreInfo: entity.moreInfoId,
			languages: entity.languages,
			tags: entity.tagIds,
			isFavourite: entity.isFavourite,
		};
	}

	static toDomainArray(models: any[]): SubjectEntity[] {
		return models
			.map((model) => this.toDomain(model))
			.filter((subject): subject is SubjectEntity => subject !== null);
	}
}
