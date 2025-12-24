import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { GetProfileUseCase } from '../application/use-cases/auth/get-profile.use-case';

describe('AuthService', () => {
    let service: AuthService;

    const mockLoginUseCase = {
        execute: jest.fn(),
    };

    const mockGetProfileUseCase = {
        execute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: LoginUseCase,
                    useValue: mockLoginUseCase,
                },
                {
                    provide: GetProfileUseCase,
                    useValue: mockGetProfileUseCase,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
