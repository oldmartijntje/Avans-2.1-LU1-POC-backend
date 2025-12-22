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
import { TagModule } from '../tag/tag.module';
import { DisplayTextModule } from '../display-text/display-text.module';
import { UsersModule } from '../users/users.module';
import { CaslModule } from '../casl/casl.module';
import { CourseModule } from '../course/course.module';

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
    DeleteCourseUseCase
];

@Module({
    imports: [
        PersistenceModule,
        TagModule,
        DisplayTextModule,
        forwardRef(() => UsersModule),
        CaslModule,
        forwardRef(() => CourseModule)
    ],
    providers: useCases,
    exports: useCases
})
export class ApplicationModule { }
