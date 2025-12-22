import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongoose/models/user.model';
import { Course, CourseSchema } from './mongoose/models/course.model';
import { Subject, SubjectSchema } from './mongoose/models/subject.model';
import { DisplayText, DisplayTextSchema } from './mongoose/models/display-text.model';
import { Tag, TagSchema } from './mongoose/models/tag.model';
import { UserRepository } from './mongoose/repositories/user.repository';
import { CourseRepository } from './mongoose/repositories/course.repository';
import { SubjectRepository } from './mongoose/repositories/subject.repository';
import { DisplayTextRepository } from './mongoose/repositories/display-text.repository';
import { TagRepository } from './mongoose/repositories/tag.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { COURSE_REPOSITORY } from '../../domain/repositories/course-repository.interface';
import { SUBJECT_REPOSITORY } from '../../domain/repositories/subject-repository.interface';
import { DISPLAY_TEXT_REPOSITORY } from '../../domain/repositories/display-text-repository.interface';
import { TAG_REPOSITORY } from '../../domain/repositories/tag-repository.interface';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Course.name, schema: CourseSchema },
            { name: Subject.name, schema: SubjectSchema },
            { name: DisplayText.name, schema: DisplayTextSchema },
            { name: Tag.name, schema: TagSchema }
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
        },
        {
            provide: SUBJECT_REPOSITORY,
            useClass: SubjectRepository
        },
        {
            provide: DISPLAY_TEXT_REPOSITORY,
            useClass: DisplayTextRepository
        },
        {
            provide: TAG_REPOSITORY,
            useClass: TagRepository
        }
    ],
    exports: [USER_REPOSITORY, COURSE_REPOSITORY, SUBJECT_REPOSITORY, DISPLAY_TEXT_REPOSITORY, TAG_REPOSITORY]
})
export class PersistenceModule { }
