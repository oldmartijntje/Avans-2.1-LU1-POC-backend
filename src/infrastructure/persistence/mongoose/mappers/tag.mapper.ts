import { Tag as TagEntity } from '../../../../domain/entities/tag.entity';
import { Tag as TagModel } from '../models/tag.model';

export class TagMapper {
    static toDomain(model: TagModel): TagEntity {
        return TagEntity.create({
            id: model._id.toString(),
            tagName: model.tagName
        });
    }

    static toPersistence(domain: Omit<TagEntity, 'id'>): Omit<TagModel, '_id'> {
        return {
            tagName: domain.tagName
        };
    }
}
