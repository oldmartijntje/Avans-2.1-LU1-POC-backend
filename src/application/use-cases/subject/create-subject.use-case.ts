import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { AddSubjectDto } from '../../dto/subject/add-subject.dto';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class CreateSubjectUseCase {
    constructor(
        @Inject(SUBJECT_REPOSITORY)
        private readonly subjectRepository: ISubjectRepository,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(dto: AddSubjectDto, userUuid: string): Promise<Subject> {
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Create, Subject)) {
            throw new UnauthorizedException();
        }

        const newTagsArray: string[] = dto.tags;

        const subject = Subject.create({
            uuid: '',
            title: dto.title,
            description: dto.description,
            ownerUuid: userUuid,
            level: dto.level,
            studyPoints: dto.studyPoints,
            moreInfo: dto.moreInfo,
            languages: dto.languages,
            tags: newTagsArray,
        });

        return await this.subjectRepository.create(subject);
    }
}
