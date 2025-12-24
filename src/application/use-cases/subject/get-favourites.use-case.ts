import { Inject, Injectable } from '@nestjs/common';

import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';

@Injectable()
export class GetFavouritesUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userUuid: string): Promise<any[]> {
        const favouriteIds = await this.userRepository.getFavouriteIds(userUuid);

        if (favouriteIds.length === 0) {
            return [];
        }

        const subjects = await this.subjectRepository.findByIds(favouriteIds);

        return subjects.map(subject => ({
            ...subject.toObject(),
            isFavourite: true
        }));
    }
}
