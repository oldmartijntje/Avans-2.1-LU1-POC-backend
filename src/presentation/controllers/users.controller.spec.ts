import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {
    GetUserUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase
} from '../../application/use-cases/user';
import { AuthGuard } from '../../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
    let controller: UsersController;

    const mockGetUserUseCase = {
        execute: jest.fn(),
    };

    const mockListUsersUseCase = {
        execute: jest.fn(),
    };

    const mockCreateUserUseCase = {
        execute: jest.fn(),
    };

    const mockUpdateUserUseCase = {
        execute: jest.fn(),
    };

    const mockDeleteUserUseCase = {
        execute: jest.fn(),
    };

    const mockJwtService = {
        verifyAsync: jest.fn(),
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: GetUserUseCase, useValue: mockGetUserUseCase },
                { provide: ListUsersUseCase, useValue: mockListUsersUseCase },
                { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
                { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
                { provide: DeleteUserUseCase, useValue: mockDeleteUserUseCase },
                { provide: JwtService, useValue: mockJwtService },
                AuthGuard,
                Reflector,
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
