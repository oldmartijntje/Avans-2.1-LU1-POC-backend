import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { PresentationModule } from './presentation/presentation.module';
import { Subject, SubjectSchema } from './subjects/schemas/subject.schema';
import { Course, CourseSchema } from './course/schema/course.schema';
import { TagMigrationService } from './migrate/migrate-tags.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        MongooseModule.forRoot(process.env.MONGO_URI ?? (() => { throw new Error("MONGO_URI is not set in the .env\nHave you used the command: `npm run setup`?\n"); })()),
        MongooseModule.forFeature([
            { name: 'Subject', schema: SubjectSchema },
            { name: 'Course', schema: CourseSchema },
        ]),
        CaslModule,
        PresentationModule,
    ],
    controllers: [AppController],
    providers: [AppService, TagMigrationService],
})
export class AppModule { }
