import { Inject, Injectable } from '@nestjs/common';

import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';

@Injectable()
export class RemoveFavouriteUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userUuid: string, subjectUuid: string): Promise<any> {
        // Get the subject to convert UUID to _id
        const subject = await this.subjectRepository.findByUuid(subjectUuid);
        if (!subject) {
            throw new Error('Subject not found');
        }

        // Remove subject _id from user's favourites
        return await this.userRepository.removeFavourite(userUuid, subject._id.toString());
    }
}
