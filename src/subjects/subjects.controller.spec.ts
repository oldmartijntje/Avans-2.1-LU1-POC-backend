import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { BadRequestException } from '@nestjs/common';

describe('SubjectsController', () => {
    let controller: SubjectsController;
    let subjectsService: SubjectsService;

    const mockSubjectsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFavourites: jest.fn(),
        findSubjectsBySimilarTags: jest.fn(),
        addFavouriteBySubjectUuid: jest.fn(),
        removeFavouriteBySubjectUuid: jest.fn(),
    };

    const mockRequest = {
        user: { sub: 'user-uuid' },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubjectsController],
            providers: [
                { provide: SubjectsService, useValue: mockSubjectsService },
            ],
        }).compile();

        controller = module.get<SubjectsController>(SubjectsController);
        subjectsService = module.get<SubjectsService>(SubjectsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /subjects', () => {
        it('should create and return subject with correct structure', async () => {
            const createDto = {
                title: { dutch: 'Test Vak', english: 'Test Subject' },
                description: { dutch: 'Beschrijving', english: 'Description' },
                moreInfo: { dutch: 'Meer info', english: 'More info' },
                level: 'NLQF-5' as const,
                studyPoints: 5,
                languages: ['nl', 'en'],
                tags: [],
            };

            const mockSubject = {
                uuid: 'subject-uuid',
                title: 'title-id',
                description: 'description-id',
                ownerUuid: 'user-uuid',
                level: 'NLQF-5',
                studyPoints: 5,
                moreInfo: 'moreinfo-id',
                languages: ['nl', 'en'],
                tags: [],
            };

            mockSubjectsService.create.mockResolvedValue(mockSubject);

            const result = await controller.create(createDto, mockRequest);

            expect(result).toEqual(mockSubject);
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('ownerUuid');
            expect(result).toHaveProperty('level');
            expect(result).toHaveProperty('studyPoints');
            expect(result).toHaveProperty('moreInfo');
            expect(result).toHaveProperty('languages');
            expect(result).toHaveProperty('tags');
            expect(typeof result.uuid).toBe('string');
            expect(['NLQF-5', 'NLQF-6']).toContain(result.level);
            expect(typeof result.studyPoints).toBe('number');
            expect(Array.isArray(result.languages)).toBe(true);
            expect(Array.isArray(result.tags)).toBe(true);
        });
    });

    describe('GET /subjects', () => {
        it('should return array of subjects with correct structure', async () => {
            const mockSubjects = [
                {
                    uuid: 'subject-1',
                    title: 'title-1',
                    description: 'description-1',
                    ownerUuid: 'owner-1',
                    level: 'NLQF-5',
                    studyPoints: 5,
                    moreInfo: 'info-1',
                    languages: ['nl'],
                    tags: [],
                    isFavourite: false,
                },
                {
                    uuid: 'subject-2',
                    title: 'title-2',
                    description: 'description-2',
                    ownerUuid: 'owner-2',
                    level: 'NLQF-6',
                    studyPoints: 10,
                    moreInfo: 'info-2',
                    languages: ['en'],
                    tags: [],
                    isFavourite: true,
                },
            ];

            mockSubjectsService.findAll.mockResolvedValue(mockSubjects);

            const result = await controller.findAll(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);

            result.forEach(subject => {
                expect(subject).toHaveProperty('uuid');
                expect(subject).toHaveProperty('title');
                expect(subject).toHaveProperty('description');
                expect(subject).toHaveProperty('ownerUuid');
                expect(subject).toHaveProperty('level');
                expect(subject).toHaveProperty('studyPoints');
                expect(subject).toHaveProperty('moreInfo');
                expect(subject).toHaveProperty('languages');
                expect(subject).toHaveProperty('tags');
                expect(typeof subject.uuid).toBe('string');
                expect(['NLQF-5', 'NLQF-6']).toContain(subject.level);
                expect(typeof subject.studyPoints).toBe('number');
                expect(Array.isArray(subject.languages)).toBe(true);
                expect(Array.isArray(subject.tags)).toBe(true);
            });
        });

        it('should filter by level query parameter', async () => {
            const mockSubjects = [
                {
                    uuid: 'subject-1',
                    title: 'title-1',
                    description: 'description-1',
                    ownerUuid: 'owner-1',
                    level: 'NLQF-5',
                    studyPoints: 5,
                    moreInfo: 'info-1',
                    languages: ['nl'],
                    tags: [],
                },
            ];

            mockSubjectsService.findAll.mockResolvedValue(mockSubjects);

            const result = await controller.findAll(mockRequest, 'NLQF-5');

            expect(subjectsService.findAll).toHaveBeenCalledWith('user-uuid', 'NLQF-5', undefined, undefined);
        });

        it('should filter by studyPoints query parameter', async () => {
            mockSubjectsService.findAll.mockResolvedValue([]);

            await controller.findAll(mockRequest, undefined, '5');

            expect(subjectsService.findAll).toHaveBeenCalledWith('user-uuid', undefined, 5, undefined);
        });

        it('should throw BadRequestException for invalid studyPoints', async () => {
            try {
                await controller.findAll(mockRequest, undefined, 'invalid');
                fail('Expected BadRequestException to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toContain('points');
            }
        });

        it('should throw BadRequestException for invalid level', async () => {
            try {
                await controller.findAll(mockRequest, 'INVALID' as any);
                fail('Expected BadRequestException to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toContain('level');
            }
        });

        it('should filter by tag query parameter', async () => {
            mockSubjectsService.findAll.mockResolvedValue([]);

            await controller.findAll(mockRequest, undefined, undefined, 'programming');

            expect(subjectsService.findAll).toHaveBeenCalledWith('user-uuid', undefined, undefined, 'programming');
        });
    });

    describe('GET /subjects/favourites', () => {
        it('should return array of favourite subjects with correct structure', async () => {
            const mockFavourites = [
                {
                    uuid: 'subject-1',
                    title: 'title-1',
                    description: 'description-1',
                    ownerUuid: 'owner-1',
                    level: 'NLQF-5',
                    studyPoints: 5,
                    moreInfo: 'info-1',
                    languages: ['nl'],
                    tags: [],
                    isFavourite: true,
                },
            ];

            mockSubjectsService.findFavourites.mockResolvedValue(mockFavourites);

            const result = await controller.getFavourites(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            result.forEach(subject => {
                expect(subject).toHaveProperty('uuid');
                expect(subject).toHaveProperty('title');
                expect(subject).toHaveProperty('isFavourite');
            });
        });
    });

    describe('GET /subjects/reccomended', () => {
        it('should return array of recommended subjects with correct structure', async () => {
            const mockRecommended = [
                {
                    uuid: 'subject-1',
                    title: 'title-1',
                    description: 'description-1',
                    ownerUuid: 'owner-1',
                    level: 'NLQF-5',
                    studyPoints: 5,
                    moreInfo: 'info-1',
                    languages: ['nl'],
                    tags: [],
                },
            ];

            mockSubjectsService.findSubjectsBySimilarTags.mockResolvedValue(mockRecommended);

            const result = await controller.findSubjectsBySimilarTags(mockRequest);

            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('POST /subjects/favourite/:uuid', () => {
        it('should add subject to favourites and return confirmation', async () => {
            const subjectUuid = 'subject-uuid';
            const mockResponse = { success: true };

            mockSubjectsService.addFavouriteBySubjectUuid.mockResolvedValue(mockResponse);

            const result = await controller.setFavourite(subjectUuid, mockRequest);

            expect(result).toBeDefined();
            expect(subjectsService.addFavouriteBySubjectUuid).toHaveBeenCalledWith('user-uuid', subjectUuid);
        });
    });

    describe('DELETE /subjects/favourite/:uuid', () => {
        it('should remove subject from favourites and return confirmation', async () => {
            const subjectUuid = 'subject-uuid';
            const mockResponse = { success: true };

            mockSubjectsService.removeFavouriteBySubjectUuid.mockResolvedValue(mockResponse);

            const result = await controller.removeFavourite(subjectUuid, mockRequest);

            expect(result).toBeDefined();
            expect(subjectsService.removeFavouriteBySubjectUuid).toHaveBeenCalledWith('user-uuid', subjectUuid);
        });
    });

    describe('GET /subjects/:uuid', () => {
        it('should return single subject with correct structure', async () => {
            const subjectUuid = 'subject-uuid';
            const mockSubject = {
                uuid: subjectUuid,
                title: 'title-id',
                description: 'description-id',
                ownerUuid: 'owner-uuid',
                level: 'NLQF-5',
                studyPoints: 5,
                moreInfo: 'info-id',
                languages: ['nl', 'en'],
                tags: [],
            };

            mockSubjectsService.findOne.mockResolvedValue(mockSubject);

            const result = await controller.findOne(subjectUuid, mockRequest);

            expect(result).toEqual(mockSubject);
            expect(result).toHaveProperty('uuid');
            expect(result.uuid).toBe(subjectUuid);
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('level');
            expect(result).toHaveProperty('studyPoints');
        });
    });

    describe('PATCH /subjects/:uuid', () => {
        it('should update subject and return updated subject with correct structure', async () => {
            const subjectUuid = 'subject-uuid';
            const updateDto = {
                studyPoints: 10,
            };

            const mockUpdatedSubject = {
                uuid: subjectUuid,
                title: 'title-id',
                description: 'description-id',
                ownerUuid: 'owner-uuid',
                level: 'NLQF-5',
                studyPoints: 10,
                moreInfo: 'info-id',
                languages: ['nl', 'en'],
                tags: [],
            };

            mockSubjectsService.update.mockResolvedValue(mockUpdatedSubject);

            const result = await controller.update(subjectUuid, updateDto, mockRequest);

            expect(result).toEqual(mockUpdatedSubject);
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('studyPoints');
            expect(result.studyPoints).toBe(10);
        });
    });

    describe('DELETE /subjects/:uuid', () => {
        it('should delete subject and return confirmation', async () => {
            const subjectUuid = 'subject-uuid';
            const mockResponse = { deleted: true };

            mockSubjectsService.delete.mockResolvedValue(mockResponse);

            const result = await controller.deleteSubject(subjectUuid, mockRequest);

            expect(result).toBeDefined();
            expect(subjectsService.delete).toHaveBeenCalledWith(subjectUuid, 'user-uuid');
        });
    });
});
