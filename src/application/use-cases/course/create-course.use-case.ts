import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { AddCourseDto } from '../../dto/course/add-course.dto';
import { GetTagByNameUseCase } from '../tag/get-tag-by-name.use-case';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class CreateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly getTagByNameUseCase: GetTagByNameUseCase,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(dto: AddCourseDto, userUuid: string): Promise<Course> {
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Create, Course)) {
            throw new UnauthorizedException();
        }

        const newTagsArray: string[] = [];
        for (const tagName of dto.tags) {
            const tag = await this.getTagByNameUseCase.execute(tagName, true);
            if (tag && tag._id) {
                newTagsArray.push(tag._id.toString());
            }
        }

        const description = await this.lookupDisplayTextUseCase.execute(
            dto.descriptionNL,
            dto.descriptionEN,
            true,
            userUuid,
        );
        const title = await this.lookupDisplayTextUseCase.execute(
            dto.titleNL,
            dto.titleEN,
            true,
            userUuid,
        );

        const course = Course.create({
            uuid: '',
            titleId: title?.toString() || '',
            descriptionId: description?.toString() || '',
            languages: dto.languages,
            tagIds: newTagsArray.map((t) => t.toString()),
        });

        return await this.courseRepository.create(course);
    }
}
