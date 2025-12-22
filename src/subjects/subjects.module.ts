import { Module, forwardRef } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectsController } from '../presentation/controllers/subjects.controller';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { UsersModule } from '../users/users.module';
import { DisplayTextModule } from '../display-text/display-text.module';
import { TagModule } from '../tag/tag.module';
import { ApplicationModule } from '../application/application.module';
import { CaslModule } from '../casl/casl.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
        forwardRef(() => UsersModule),
        forwardRef(() => DisplayTextModule),
        forwardRef(() => TagModule),
        CaslModule,
        forwardRef(() => ApplicationModule)
    ],
    controllers: [SubjectsController],
    providers: [
        SubjectsService
    ],
    exports: [SubjectsService]
})
export class SubjectsModule { }
