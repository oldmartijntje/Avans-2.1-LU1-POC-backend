import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongoose/models/user.model';
import { Course, CourseSchema } from './mongoose/models/course.model';
import { UserRepository } from './mongoose/repositories/user.repository';
import { CourseRepository } from './mongoose/repositories/course.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { COURSE_REPOSITORY } from '../../domain/repositories/course-repository.interface';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Course.name, schema: CourseSchema }
        ])
    ],
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository
        },
        {
            provide: COURSE_REPOSITORY,
            useClass: CourseRepository
        }
    ],
    exports: [USER_REPOSITORY, COURSE_REPOSITORY]
})
export class PersistenceModule { }
