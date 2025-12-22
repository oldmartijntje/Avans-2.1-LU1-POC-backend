import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { UpdateCourseDto } from '../../dto/course/update-course.dto';
import { TagService } from '../../../tag/tag.service';
import { DisplayTextService } from '../../../display-text/display-text.service';
import { GetUserUseCase } from '../user/get-user.use-case';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { CourseService } from '../../../course/course.service';

@Injectable()
export class UpdateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly tagService: TagService,
        private readonly displayTextService: DisplayTextService,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly courseService: CourseService, // Need for authorization check
    ) { }

    async execute(
        uuid: string,
        dto: UpdateCourseDto,
        userUuid: string,
    ): Promise<Course> {
        // Get existing course for authorization
        const existingCourse = await this.courseService.findByUuid(uuid, true);

        // Authorization check
        const user = await this.getUserUseCase.execute(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Update, existingCourse)) {
            throw new UnauthorizedException();
        }

        // Process tags if provided
        let newTagsArray: Types.ObjectId[] | undefined;
        if (dto.tags) {
            newTagsArray = [];
            for (const tagName of dto.tags) {
                const tag = await this.tagService.lookupByName(tagName, true);
                if (tag) {
                    newTagsArray.push(tag);
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
            await this.displayTextService.lookupByTranslations(
                descriptionNL,
                descriptionEN,
                true,
                userUuid,
            );
        const updatedTitle = await this.displayTextService.lookupByTranslations(
            titleNL,
            titleEN,
            true,
            userUuid,
        );

        const updates: Partial<Course> = {};
        if (updatedTitle) updates.titleId = updatedTitle.toString();
        if (updatedDescription)
            updates.descriptionId = updatedDescription.toString();
        if (dto.languages) updates.languages = dto.languages;
        if (newTagsArray) updates.tagIds = newTagsArray.map((t) => t.toString());

        return await this.courseRepository.update(uuid, updates);
    }
}
