import { Module, forwardRef } from '@nestjs/common';
import { DisplayTextService } from './display-text.service';
import { DisplayTextController } from '../presentation/controllers/display-text.controller';
import { DisplayText, DisplayTextSchema } from './schemas/display-text.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CaslModule } from '../casl/casl.module';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { Course, CourseSchema } from '../course/schema/course.schema';
import { ApplicationModule } from '../application/application.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DisplayText.name, schema: DisplayTextSchema }]),
        MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
        forwardRef(() => UsersModule),
        CaslModule,
        forwardRef(() => ApplicationModule)
    ],
    providers: [
        DisplayTextService
    ],
    controllers: [DisplayTextController],
    exports: [DisplayTextService]
})
export class DisplayTextModule { }
