import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';

@Injectable()
export class LeaveStudyUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userUuid: string): Promise<any> {
        return await this.userRepository.update(userUuid, { studyId: null });
    }
}
