import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserUseCase } from '../application/use-cases/auth/register-user.use-case';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let registerUserUseCase: RegisterUserUseCase;

    const mockAuthService = {
        signIn: jest.fn(),
        getProfile: jest.fn(),
    };

    const mockRegisterUserUseCase = {
        execute: jest.fn(),
    };

    const mockJwtService = {
        verifyAsync: jest.fn(),
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
                { provide: JwtService, useValue: mockJwtService },
                AuthGuard,
                Reflector,
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        registerUserUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /auth/login', () => {
        it('should return access_token with correct structure', async () => {
            const mockResponse = { access_token: 'mock-jwt-token' };
            mockAuthService.signIn.mockResolvedValue(mockResponse);

            const result = await controller.signIn({
                username: 'testuser',
                password: 'testpass'
            });

            expect(result).toEqual(mockResponse);
            expect(result).toHaveProperty('access_token');
            expect(typeof result.access_token).toBe('string');
            expect(authService.signIn).toHaveBeenCalledWith('testuser', 'testpass');
        });
    });

    describe('POST /auth/register', () => {
        it('should return user object with correct structure', async () => {
            const createUserDto = {
                username: 'newuser',
                password: 'password123',
                email: 'test@example.com',
                role: 'STUDENT' as const,
            };

            const mockUser = {
                uuid: 'test-uuid',
                username: 'newuser',
                email: 'test@example.com',
                role: 'STUDENT',
                study: null,
                favourites: [],
            };

            mockRegisterUserUseCase.execute.mockResolvedValue(mockUser);

            const result = await controller.signup(createUserDto);

            expect(result).toEqual(mockUser);
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('username');
            expect(result).toHaveProperty('email');
            expect(result).toHaveProperty('role');
            expect(result).toHaveProperty('study');
            expect(result).toHaveProperty('favourites');
            expect(typeof result.uuid).toBe('string');
            expect(typeof result.username).toBe('string');
            expect(typeof result.email).toBe('string');
            expect(['STUDENT', 'TEACHER', 'ADMIN']).toContain(result.role);
            expect(Array.isArray(result.favourites)).toBe(true);
        });

        it('should throw UnauthorizedException when trying to register as ADMIN', async () => {
            const createUserDto = {
                username: 'newuser',
                password: 'password123',
                email: 'test@example.com',
                role: 'ADMIN' as const,
            };

            mockRegisterUserUseCase.execute.mockRejectedValue(
                new UnauthorizedException('You do not have permissions to do this.')
            );

            try {
                await controller.signup(createUserDto);
                fail('Expected UnauthorizedException to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
                expect(error.message).toContain('permissions');
            }
        });
    });

    describe('GET /auth/profile', () => {
        it('should return user profile with correct structure', async () => {
            const mockProfileData = {
                uuid: 'user-uuid',
                username: 'testuser',
                email: 'test@example.com',
                role: 'STUDENT',
                study: null,
                favourites: [],
            };

            const mockRequest = {
                user: { sub: 'user-uuid' },
            };

            mockAuthService.getProfile.mockResolvedValue(mockProfileData);

            const result = await controller.getProfile(mockRequest);

            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('username');
            expect(result).toHaveProperty('email');
            expect(result).toHaveProperty('role');
            expect(result).toHaveProperty('study');
            expect(result).toHaveProperty('favourites');
            expect(result.sub).toBeUndefined();
            expect(typeof result.uuid).toBe('string');
            expect(typeof result.username).toBe('string');
            expect(typeof result.email).toBe('string');
            expect(['STUDENT', 'TEACHER', 'ADMIN']).toContain(result.role);
            expect(Array.isArray(result.favourites)).toBe(true);
        });
    });
});
