import { Course as CourseEntity } from '../../../../domain/entities/course.entity';
import { Course as CourseModel } from '../models/course.model';

export class CourseMapper {
    static toDomain(model: any): CourseEntity | null {
        if (!model) return null;

        return CourseEntity.create({
            uuid: model.uuid,
            titleId: model.title?.toString() || '',
            descriptionId: model.description?.toString() || '',
            languages: model.languages || [],
            tags: model.tags || [],
        });
    }

    static toPersistence(entity: CourseEntity): any {
        return {
            uuid: entity.uuid,
            title: entity.titleId,
            description: entity.descriptionId,
            languages: entity.languages,
            tags: entity.tags,
        };
    }

    static toDomainArray(models: any[]): CourseEntity[] {
        return models
            .map((model) => this.toDomain(model))
            .filter((course): course is CourseEntity => course !== null);
    }
}
