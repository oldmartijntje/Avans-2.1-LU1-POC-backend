import { Module, forwardRef } from '@nestjs/common';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';
import {
    GetUserUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase
} from './use-cases/user';
import {
    GetCourseUseCase,
    ListCoursesUseCase,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase
} from './use-cases/course';
import {
    GetSubjectUseCase,
    ListSubjectsUseCase,
    CreateSubjectUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase
} from './use-cases/subject';
import {
    GetDisplayTextUseCase,
    ListDisplayTextsUseCase,
    GetDisplayTextByUiKeyUseCase,
    CreateDisplayTextUseCase,
    UpdateDisplayTextUseCase,
    DeleteDisplayTextUseCase,
    FindUnusedDisplayTextsUseCase,
    DeleteDuplicatesUseCase,
    LookupDisplayTextByTranslationsUseCase
} from './use-cases/display-text';
import {
    ListTagsUseCase,
    GetTagUseCase,
    GetTagByNameUseCase,
    CreateTagUseCase,
    DeleteTagUseCase
} from './use-cases/tag';
import { TagModule } from '../tag/tag.module';
import { DisplayTextModule } from '../display-text/display-text.module';
import { UsersModule } from '../users/users.module';
import { CaslModule } from '../casl/casl.module';
import { CourseModule } from '../course/course.module';
import { SubjectsModule } from '../subjects/subjects.module';

const useCases = [
    GetUserUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetCourseUseCase,
    ListCoursesUseCase,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    GetSubjectUseCase,
    ListSubjectsUseCase,
    CreateSubjectUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase,
    GetDisplayTextUseCase,
    ListDisplayTextsUseCase,
    GetDisplayTextByUiKeyUseCase,
    CreateDisplayTextUseCase,
    UpdateDisplayTextUseCase,
    DeleteDisplayTextUseCase,
    FindUnusedDisplayTextsUseCase,
    DeleteDuplicatesUseCase,
    LookupDisplayTextByTranslationsUseCase,
    ListTagsUseCase,
    GetTagUseCase,
    GetTagByNameUseCase,
    CreateTagUseCase,
    DeleteTagUseCase
];

@Module({
    imports: [
        PersistenceModule,
        forwardRef(() => TagModule),
        DisplayTextModule,
        forwardRef(() => UsersModule),
        CaslModule,
        forwardRef(() => CourseModule),
        forwardRef(() => SubjectsModule),
    ],
    providers: useCases,
    exports: useCases
})
export class ApplicationModule { }
