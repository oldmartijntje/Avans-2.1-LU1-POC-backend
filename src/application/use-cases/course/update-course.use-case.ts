import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { UpdateCourseDto } from '../../dto/course/update-course.dto';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class UpdateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(
        uuid: string,
        dto: UpdateCourseDto,
        userUuid: string,
    ): Promise<Course> {
        const existingCourse = await this.courseRepository.findById(uuid, true);

        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Update, existingCourse)) {
            throw new UnauthorizedException();
        }

        let newTagsArray: string[] | undefined;
        if (dto.tags) {
            newTagsArray = dto.tags;
        }

        const updates: Partial<Course> = {};
        // Merge translation fields if partial update
        if (dto.title) {
            updates.title = {
                dutch: dto.title.dutch ?? existingCourse.title.dutch,
                english: dto.title.english ?? existingCourse.title.english,
            };
        }
        if (dto.description) {
            updates.description = {
                dutch: dto.description.dutch ?? existingCourse.description.dutch,
                english: dto.description.english ?? existingCourse.description.english,
            };
        }
        if (dto.languages) updates.languages = dto.languages;
        if (newTagsArray) updates.tags = newTagsArray;

        // Debug log
        // eslint-disable-next-line no-console
        console.log('[UpdateCourseUseCase] updates:', JSON.stringify(updates));
        return await this.courseRepository.update(uuid, updates);
    }
}
