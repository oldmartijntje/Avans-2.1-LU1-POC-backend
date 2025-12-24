import { Inject, Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserDto {
    username: string;
    email: string;
    password: string;
    role?: 'TEACHER' | 'STUDENT' | 'ADMIN';
}

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(dto: RegisterUserDto): Promise<User> {
        // Prevent admin registration
        if (dto.role === 'ADMIN') {
            throw new UnauthorizedException('You do not have permissions to do this.');
        }

        // Ensure username is not already taken
        const usernameExists = await this.userRepository.existsByUsername(dto.username);
        if (usernameExists) {
            throw new ConflictException('Username already taken');
        }

        // Create user entity with UUID
        const user = User.create({
            uuid: uuidv4(),
            username: dto.username,
            email: dto.email,
            role: (dto.role as UserRole) || UserRole.STUDENT,
        });

        return await this.userRepository.create(user, dto.password);
    }
}
