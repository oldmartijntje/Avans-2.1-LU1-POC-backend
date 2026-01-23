import { Subject as SubjectEntity } from '../../../../domain/entities/subject.entity';
import { Subject as SubjectModel } from '../models/subject.model';

export class SubjectMapper {
    static toDomain(model: any): SubjectEntity | null {
        if (!model) return null;

        return SubjectEntity.create({
            uuid: model.uuid,
            title: model.title,
            description: model.description,
            ownerUuid: model.ownerUuid,
            level: model.level,
            studyPoints: model.studyPoints,
            moreInfo: model.moreInfo,
            languages: model.languages || [],
            tags: model.tags || [],
            isFavourite: model.isFavourite,
        });
    }

    static toPersistence(entity: SubjectEntity): any {
        return {
            uuid: entity.uuid,
            title: entity.title,
            description: entity.description,
            ownerUuid: entity.ownerUuid,
            level: entity.level,
            studyPoints: entity.studyPoints,
            moreInfo: entity.moreInfo,
            languages: entity.languages,
            tags: entity.tags,
            isFavourite: entity.isFavourite,
        };
    }

    static toDomainArray(models: any[]): SubjectEntity[] {
        return models
            .map((model) => this.toDomain(model))
            .filter((subject): subject is SubjectEntity => subject !== null);
    }
}
