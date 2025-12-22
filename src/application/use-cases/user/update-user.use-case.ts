import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import { UpdateUserDto } from '../../dto/user/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(uuid: string, dto: UpdateUserDto): Promise<User> {
        const updates: Partial<User> = {};

        if (dto.email) updates.email = dto.email;
        if (dto.role) updates.role = dto.role;

        return await this.userRepository.update(uuid, updates);
    }
}
