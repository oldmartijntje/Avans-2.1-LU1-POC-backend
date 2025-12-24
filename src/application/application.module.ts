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
    DeleteCourseUseCase,
    JoinStudyUseCase,
    LeaveStudyUseCase,
    GetJoinedStudyUseCase
} from './use-cases/course';
import {
    GetSubjectUseCase,
    ListSubjectsUseCase,
    CreateSubjectUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase,
    AddFavouriteUseCase,
    RemoveFavouriteUseCase,
    GetFavouritesUseCase,
    GetRecommendedSubjectsUseCase
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
    LookupDisplayTextByTranslationsUseCase,
    FindUiElementsUseCase,
    FindAllByUiKeysUseCase,
    DeleteUnusedUseCase,
    MassUpdateUseCase
} from './use-cases/display-text';
import {
    ListTagsUseCase,
    GetTagUseCase,
    GetTagByNameUseCase,
    CreateTagUseCase,
    DeleteTagUseCase
} from './use-cases/tag';
import {
    LoginUseCase,
    RegisterUserUseCase,
    GetProfileUseCase
} from './use-cases/auth';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
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
    JoinStudyUseCase,
    LeaveStudyUseCase,
    GetJoinedStudyUseCase,
    GetSubjectUseCase,
    ListSubjectsUseCase,
    CreateSubjectUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase,
    AddFavouriteUseCase,
    RemoveFavouriteUseCase,
    GetFavouritesUseCase,
    GetRecommendedSubjectsUseCase,
    GetDisplayTextUseCase,
    ListDisplayTextsUseCase,
    GetDisplayTextByUiKeyUseCase,
    CreateDisplayTextUseCase,
    UpdateDisplayTextUseCase,
    DeleteDisplayTextUseCase,
    FindUnusedDisplayTextsUseCase,
    DeleteDuplicatesUseCase,
    LookupDisplayTextByTranslationsUseCase,
    FindUiElementsUseCase,
    FindAllByUiKeysUseCase,
    DeleteUnusedUseCase,
    MassUpdateUseCase,
    ListTagsUseCase,
    GetTagUseCase,
    GetTagByNameUseCase,
    CreateTagUseCase,
    DeleteTagUseCase,
    LoginUseCase,
    RegisterUserUseCase,
    GetProfileUseCase
];

@Module({
    imports: [
        PersistenceModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
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
