import { Module } from '@nestjs/common';
import { TagController } from './controllers/tag.controller';
import { SubjectsController } from './controllers/subjects.controller';
import { CourseController } from './controllers/course.controller';
import { DisplayTextController } from './controllers/display-text.controller';
import { UsersController } from './controllers/users.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
    imports: [ApplicationModule],
    controllers: [
        TagController,
        SubjectsController,
        CourseController,
        DisplayTextController,
        UsersController
    ]
})
export class PresentationModule { }
