import { Module, forwardRef } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from '../presentation/controllers/tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema';
import { ApplicationModule } from '../application/application.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
        forwardRef(() => ApplicationModule)
    ],
    providers: [TagService],
    controllers: [TagController],
    exports: [TagService]
})
export class TagModule { }
