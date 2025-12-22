import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongoose/models/user.model';
import { UserRepository } from './mongoose/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ])
    ],
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository
        }
    ],
    exports: [USER_REPOSITORY]
})
export class PersistenceModule { }
