import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { AddCourseDto } from '../../dto/course/add-course.dto';
import { TagService } from '../../../tag/tag.service';
import { DisplayTextService } from '../../../display-text/display-text.service';
import { UsersService } from '../../../users/users.service';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { Course as CourseSchema } from '../../../course/schema/course.schema';

@Injectable()
export class CreateCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly tagService: TagService,
        private readonly displayTextService: DisplayTextService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async execute(dto: AddCourseDto, userUuid: string): Promise<Course> {
        // Authorization check
        const user = await this.usersService.findOne(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Create, CourseSchema)) {
            throw new UnauthorizedException();
        }

        // Process tags
        const newTagsArray: Types.ObjectId[] = [];
        for (const tagName of dto.tags) {
            const tag = await this.tagService.lookupByName(tagName, true);
            if (tag) {
                newTagsArray.push(tag);
            }
        }

        // Create display texts
        const description = await this.displayTextService.lookupByTranslations(
            dto.descriptionNL,
            dto.descriptionEN,
            true,
            userUuid,
        );
        const title = await this.displayTextService.lookupByTranslations(
            dto.titleNL,
            dto.titleEN,
            true,
            userUuid,
        );

        const course = Course.create({
            uuid: '', // Will be generated in repository
            titleId: title?.toString() || '',
            descriptionId: description?.toString() || '',
            languages: dto.languages,
            tagIds: newTagsArray.map((t) => t.toString()),
        });

        return await this.courseRepository.create(course);
    }
}
