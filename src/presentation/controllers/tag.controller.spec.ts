import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('TagController', () => {
    let controller: TagController;
    let tagService: TagService;

    const mockTagService = {
        findAll: jest.fn(),
    };

    const mockRequest = {
        user: { sub: 'user-uuid' },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TagController],
            providers: [
                { provide: TagService, useValue: mockTagService },
            ],
        }).compile();

        controller = module.get<TagController>(TagController);
        tagService = module.get<TagService>(TagService);
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

            mockTagService.findAll.mockResolvedValue(mockTags);

            const result = await controller.findAll(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(3);

            result.forEach(tag => {
                expect(tag).toHaveProperty('tagName');
                expect(typeof tag.tagName).toBe('string');
            });
        });

        it('should return empty array when no tags exist', async () => {
            mockTagService.findAll.mockResolvedValue([]);

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

            mockTagService.findAll.mockResolvedValue(mockTags);

            // Request without user
            const anonRequest = { user: undefined };
            const result = await controller.findAll(anonRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
        });
    });
});
