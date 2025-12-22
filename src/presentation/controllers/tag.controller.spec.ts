import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import {
    ListTagsUseCase,
    GetTagUseCase,
    CreateTagUseCase,
    DeleteTagUseCase
} from '../../application/use-cases/tag';
import { AuthGuard } from '../../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('TagController', () => {
    let controller: TagController;

    const mockListTagsUseCase = {
        execute: jest.fn(),
    };

    const mockGetTagUseCase = {
        execute: jest.fn(),
    };

    const mockCreateTagUseCase = {
        execute: jest.fn(),
    };

    const mockDeleteTagUseCase = {
        execute: jest.fn(),
    };

    const mockJwtService = {
        verifyAsync: jest.fn(),
        sign: jest.fn(),
    };

    const mockRequest = {
        user: { sub: 'user-uuid' },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TagController],
            providers: [
                { provide: ListTagsUseCase, useValue: mockListTagsUseCase },
                { provide: GetTagUseCase, useValue: mockGetTagUseCase },
                { provide: CreateTagUseCase, useValue: mockCreateTagUseCase },
                { provide: DeleteTagUseCase, useValue: mockDeleteTagUseCase },
                { provide: JwtService, useValue: mockJwtService },
                AuthGuard,
                Reflector,
            ],
        }).compile();

        controller = module.get<TagController>(TagController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET /tag', () => {
        it('should return array of tags with correct structure', async () => {
            const mockTags = [
                {
                    _id: 'tag-id-1',
                    tagName: 'Programming',
                },
                {
                    _id: 'tag-id-2',
                    tagName: 'Mathematics',
                },
                {
                    _id: 'tag-id-3',
                    tagName: 'Design',
                },
            ];

            mockListTagsUseCase.execute.mockResolvedValue(mockTags);

            const result = await controller.findAll(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(3);

            result.forEach(tag => {
                expect(tag).toHaveProperty('tagName');
                expect(typeof tag.tagName).toBe('string');
            });
        });

        it('should return empty array when no tags exist', async () => {
            mockListTagsUseCase.execute.mockResolvedValue([]);

            const result = await controller.findAll(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(0);
        });

        it('should be accessible without authentication (AllowAnon)', async () => {
            const mockTags = [
                {
                    _id: 'tag-id-1',
                    tagName: 'Public Tag',
                },
            ];

            mockListTagsUseCase.execute.mockResolvedValue(mockTags);

            // Request without user
            const anonRequest = { user: undefined };
            const result = await controller.findAll(anonRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
        });
    });
});
