import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import { UsersService } from '../../../users/users.service';
import { CaslAbilityFactory } from '../../../casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '../../../casl/dto/caslAction.enum';
import { CourseService } from '../../../course/course.service';

@Injectable()
export class DeleteCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY)
        private readonly courseRepository: ICourseRepository,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly courseService: CourseService, // Need for authorization check
    ) { }

    async execute(uuid: string, userUuid: string): Promise<boolean> {
        // Get existing course for authorization
        const existingCourse = await this.courseService.findByUuid(uuid, false);

        // Authorization check
        const user = await this.usersService.findOne(userUuid);
        const ability = this.caslAbilityFactory.createForUser(user);
        if (!ability.can(CaslAction.Delete, existingCourse)) {
            throw new UnauthorizedException();
        }

        return await this.courseRepository.delete(uuid);
    }
}
