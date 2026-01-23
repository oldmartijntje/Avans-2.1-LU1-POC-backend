import { DisplayText as DisplayTextEntity } from '../../../../domain/entities/display-text.entity';
import { DisplayText as DisplayTextModel } from '../models/display-text.model';

export class DisplayTextMapper {
    static toDomain(model: DisplayTextModel): DisplayTextEntity {
        return DisplayTextEntity.create({
            id: model._id.toString(),
            dutch: model.dutch,
            english: model.english,
            // creatorUuid removed
            uiKey: model.uiKey
        });
    }

    static toPersistence(domain: Omit<DisplayTextEntity, 'id'>): Omit<DisplayTextModel, '_id'> {
        return {
            dutch: domain.dutch,
            english: domain.english,
            // creatorUuid removed
            uiKey: domain.uiKey
        };
    }
}
