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
    LoginUseCase,
    RegisterUserUseCase,
    GetProfileUseCase
} from './use-cases/auth';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { CaslModule } from '../casl/casl.module';

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
        CaslModule,
    ],
    providers: useCases,
    exports: useCases
})
export class ApplicationModule { }
