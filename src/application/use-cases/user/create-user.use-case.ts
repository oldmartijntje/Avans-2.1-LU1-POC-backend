import { Inject, Injectable } from '@nestjs/common';
import { User, UserRole } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import { CreateUserDto } from '../../dto/user/create-user.dto';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(dto: CreateUserDto): Promise<User> {
        const user = User.create({
            uuid: '',
            username: dto.username,
            email: dto.email,
            role: dto.role,
            studyId: null,
            favouriteIds: []
        });

        return await this.userRepository.create(user, dto.password);
    }
}
