import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService
    ) { }

    async execute(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userRepository.findByUsernameForAuth(username);
        
        // Ensure user has a password and compare with bcrypt
        if (!user || !(user as any).password) {
            throw new UnauthorizedException();
        }
        
        const match = await bcrypt.compare(password, (user as any).password);
        if (!match) {
            throw new UnauthorizedException();
        }
        
        const payload = { sub: user.uuid, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
