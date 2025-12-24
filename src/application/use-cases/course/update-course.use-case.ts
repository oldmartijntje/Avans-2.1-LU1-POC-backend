import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { UpdateCourseDto } from '../../dto/course/update-course.dto';
import { GetTagByNameUseCase } from '../tag/get-tag-by-name.use-case';
import { LookupDisplayTextByTranslationsUseCase } from '../display-text/lookup-by-translations.use-case';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';

@Injectable()
export class UpdateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly getTagByNameUseCase: GetTagByNameUseCase,
        private readonly lookupDisplayTextUseCase: LookupDisplayTextByTranslationsUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(
        uuid: string,
        dto: UpdateCourseDto,
        userUuid: string,
    ): Promise<Course> {
        // Get existing course for authorization
        const existingCourse = await this.courseRepository.findById(uuid, true);

        // Authorization check
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Update, existingCourse)) {
            throw new UnauthorizedException();
        }

        // Process tags if provided
        let newTagsArray: string[] | undefined;
        if (dto.tags) {
            newTagsArray = [];
            for (const tagName of dto.tags) {
                const tag = await this.getTagByNameUseCase.execute(tagName, true);
                if (tag && tag._id) {
                    newTagsArray.push(tag._id.toString());
                }
            }
        }

        // Get existing display text data
        const description = existingCourse.description as any;
        const title = existingCourse.title as any;

        const descriptionNL = dto.descriptionNL || description?.nl;
        const descriptionEN = dto.descriptionEN || description?.en;
        const titleNL = dto.titleNL || title?.nl;
        const titleEN = dto.titleEN || title?.en;

        // Update display texts
        const updatedDescription =
            await this.lookupDisplayTextUseCase.execute(
                descriptionNL,
                descriptionEN,
                true,
                userUuid,
            );
        const updatedTitle = await this.lookupDisplayTextUseCase.execute(
            titleNL,
            titleEN,
            true,
            userUuid,
        );

        const updates: Partial<Course> = {};
        if (updatedTitle) updates.titleId = updatedTitle._id?.toString() || '';
        if (updatedDescription)
            updates.descriptionId = updatedDescription._id?.toString() || '';
        if (dto.languages) updates.languages = dto.languages;
        if (newTagsArray) updates.tagIds = newTagsArray;

        return await this.courseRepository.update(uuid, updates);
    }
}
