import { User as UserEntity, UserRole } from '../../../../domain/entities/user.entity';
import { User as UserModel } from '../models/user.model';

export class UserMapper {
    static toDomain(model: any): UserEntity | null {
        if (!model) return null;

        return UserEntity.create({
            uuid: model.uuid,
            username: model.username,
            email: model.email,
            role: model.role as UserRole,
            studyId: model.study?.toString() || null,
            favouriteIds: model.favourites?.map(f => f.toString()) || [],
            password: model.password
        });
    }

    static toPersistence(entity: UserEntity): any {
        return {
            uuid: entity.uuid,
            username: entity.username,
            email: entity.email,
            role: entity.role,
            study: entity.studyId,
            favourites: entity.favouriteIds || []
        };
    }

    static toDomainArray(models: any[]): UserEntity[] {
        return models.map(model => this.toDomain(model)).filter((user): user is UserEntity => user !== null);
    }
}
