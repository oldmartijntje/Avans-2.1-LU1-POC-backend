import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { UsersService } from '../../../users/users.service';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { SubjectsService } from '../../../subjects/subjects.service';

@Injectable()
export class DeleteSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly subjectsService: SubjectsService,
    ) { }

    async execute(uuid: string, userUuid: string): Promise<boolean> {
        // Get existing subject for authorization
        const existingSubject = await this.subjectsService.findByUuid(uuid, false);

        // Authorization check
        const user = await this.usersService.findOne(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Delete, existingSubject)) {
            throw new UnauthorizedException();
        }

        return await this.subjectRepository.delete(uuid);
    }
}
