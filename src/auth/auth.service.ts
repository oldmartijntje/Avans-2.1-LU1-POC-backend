
import { Injectable } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { GetProfileUseCase } from '../application/use-cases/auth/get-profile.use-case';

@Injectable()
export class AuthService {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly getProfileUseCase: GetProfileUseCase
    ) { }

    async signIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        return await this.loginUseCase.execute(username, pass);
    }

    async getProfile(userUuid: string) {
        return await this.getProfileUseCase.execute(userUuid);
    }
}
