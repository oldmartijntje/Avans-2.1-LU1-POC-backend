import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../presentation/controllers/users.controller';
import { ApplicationModule } from '../application/application.module';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        forwardRef(() => ApplicationModule),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService] // Keep exporting for Auth module compatibility
})
export class UsersModule { }
