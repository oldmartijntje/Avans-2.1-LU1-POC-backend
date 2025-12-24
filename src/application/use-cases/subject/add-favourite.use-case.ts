import { Inject, Injectable } from '@nestjs/common';

import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';

@Injectable()
export class AddFavouriteUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userUuid: string, subjectUuid: string): Promise<any> {
        const subject = await this.subjectRepository.findById(subjectUuid, false);
        if (!subject) {
            throw new Error('Subject not found');
        }

        return await this.userRepository.addFavourite(userUuid, subject._id.toString());
    }
}
