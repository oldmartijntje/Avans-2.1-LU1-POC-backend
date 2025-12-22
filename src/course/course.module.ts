import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from './course.service';
import { CourseController } from '../presentation/controllers/course.controller';
import { Course, CourseSchema } from './schema/course.schema';
import { UsersModule } from '../users/users.module';
import { DisplayTextModule } from '../display-text/display-text.module';
import { TagModule } from '../tag/tag.module';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { ApplicationModule } from '../application/application.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
        forwardRef(() => UsersModule),
        forwardRef(() => DisplayTextModule),
        forwardRef(() => TagModule),
        forwardRef(() => ApplicationModule)
    ],
    providers: [CourseService, CaslAbilityFactory],
    controllers: [CourseController],
    exports: [CourseService]
})
export class CourseModule { }
