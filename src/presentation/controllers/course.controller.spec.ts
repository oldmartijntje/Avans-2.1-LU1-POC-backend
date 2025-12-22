import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from '../../course/course.service';
import {
    GetCourseUseCase,
    ListCoursesUseCase,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
} from '../../application/use-cases/course';

describe('CourseController', () => {
    let controller: CourseController;
    let courseService: CourseService;

    const mockCourseService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getStudy: jest.fn(),
        joinStudy: jest.fn(),
        leaveStudy: jest.fn(),
    };

    const mockGetCourseUseCase = {
        execute: jest.fn(),
    };

    const mockListCoursesUseCase = {
        execute: jest.fn(),
    };

    const mockCreateCourseUseCase = {
        execute: jest.fn(),
    };

    const mockUpdateCourseUseCase = {
        execute: jest.fn(),
    };

    const mockDeleteCourseUseCase = {
        execute: jest.fn(),
    };

    const mockRequest = {
        user: { sub: 'user-uuid' },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CourseController],
            providers: [
                { provide: GetCourseUseCase, useValue: mockGetCourseUseCase },
                { provide: ListCoursesUseCase, useValue: mockListCoursesUseCase },
                { provide: CreateCourseUseCase, useValue: mockCreateCourseUseCase },
                { provide: UpdateCourseUseCase, useValue: mockUpdateCourseUseCase },
                { provide: DeleteCourseUseCase, useValue: mockDeleteCourseUseCase },
                { provide: CourseService, useValue: mockCourseService },
            ],
        }).compile();

        controller = module.get<CourseController>(CourseController);
        courseService = module.get<CourseService>(CourseService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /course', () => {
        it('should create and return course with correct structure', async () => {
            const createDto = {
                title: { dutch: 'Test Cursus', english: 'Test Course' },
                description: { dutch: 'Beschrijving', english: 'Description' },
                languages: ['nl', 'en'],
                tags: [],
            };

            const mockCourse = {
                uuid: 'course-uuid',
                title: 'title-id',
                description: 'description-id',
                languages: ['nl', 'en'],
                tags: [],
            };

            mockCreateCourseUseCase.execute.mockResolvedValue(mockCourse);

            const result = await controller.create(createDto, mockRequest);

            expect(result).toEqual(mockCourse);
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('languages');
            expect(result).toHaveProperty('tags');
            expect(typeof result.uuid).toBe('string');
            expect(Array.isArray(result.languages)).toBe(true);
            expect(Array.isArray(result.tags)).toBe(true);
        });
    });

    describe('GET /course', () => {
        it('should return array of courses with correct structure', async () => {
            const mockCourses = [
                {
                    uuid: 'course-1',
                    title: 'title-1',
                    description: 'description-1',
                    languages: ['nl'],
                    tags: [],
                },
                {
                    uuid: 'course-2',
                    title: 'title-2',
                    description: 'description-2',
                    languages: ['en'],
                    tags: [],
                },
            ];

            mockListCoursesUseCase.execute.mockResolvedValue(mockCourses);

            const result = await controller.findAll();

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);

            result.forEach(course => {
                expect(course).toHaveProperty('uuid');
                expect(course).toHaveProperty('title');
                expect(course).toHaveProperty('description');
                expect(course).toHaveProperty('languages');
                expect(course).toHaveProperty('tags');
                expect(typeof course.uuid).toBe('string');
                expect(Array.isArray(course.languages)).toBe(true);
                expect(Array.isArray(course.tags)).toBe(true);
            });
        });
    });

    describe('GET /course/joined', () => {
        it('should return joined course with correct structure', async () => {
            const mockCourse = {
                uuid: 'course-uuid',
                title: 'title-id',
                description: 'description-id',
                languages: ['nl', 'en'],
                tags: [],
            };

            mockCourseService.getStudy.mockResolvedValue(mockCourse);

            const result = await controller.findJoined(mockRequest);

            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('languages');
            expect(result).toHaveProperty('tags');
        });
    });

    describe('POST /course/joined/:uuid', () => {
        it('should join study and return confirmation', async () => {
            const courseUuid = 'course-uuid';
            const mockResponse = { success: true };

            mockCourseService.joinStudy.mockResolvedValue(mockResponse);

            const result = await controller.join(courseUuid, mockRequest);

            expect(result).toBeDefined();
            expect(courseService.joinStudy).toHaveBeenCalledWith('user-uuid', courseUuid);
        });
    });

    describe('DELETE /course/joined', () => {
        it('should leave study and return confirmation', async () => {
            const mockResponse = { success: true };

            mockCourseService.leaveStudy.mockResolvedValue(mockResponse);

            const result = await controller.leave(mockRequest);

            expect(result).toBeDefined();
            expect(courseService.leaveStudy).toHaveBeenCalledWith('user-uuid');
        });
    });

    describe('GET /course/:uuid', () => {
        it('should return single course with correct structure', async () => {
            const courseUuid = 'course-uuid';
            const mockCourse = {
                uuid: courseUuid,
                title: 'title-id',
                description: 'description-id',
                languages: ['nl', 'en'],
                tags: [],
            };

            mockGetCourseUseCase.execute.mockResolvedValue(mockCourse);

            const result = await controller.findOne(courseUuid);

            expect(result).toEqual(mockCourse);
            expect(result).toHaveProperty('uuid');
            expect(result.uuid).toBe(courseUuid);
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('languages');
            expect(result).toHaveProperty('tags');
        });
    });

    describe('PATCH /course/:uuid', () => {
        it('should update course and return updated course with correct structure', async () => {
            const courseUuid = 'course-uuid';
            const updateDto = {
                languages: ['nl', 'en', 'de'],
            };

            const mockUpdatedCourse = {
                uuid: courseUuid,
                title: 'title-id',
                description: 'description-id',
                languages: ['nl', 'en', 'de'],
                tags: [],
            };

            mockUpdateCourseUseCase.execute.mockResolvedValue(mockUpdatedCourse);

            const result = await controller.update(courseUuid, updateDto, mockRequest);

            expect(result).toEqual(mockUpdatedCourse);
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('languages');
            expect(result.languages).toContain('de');
        });
    });

    describe('DELETE /course/:uuid', () => {
        it('should delete course and return confirmation', async () => {
            const courseUuid = 'course-uuid';
            const mockResponse = { deleted: true };

            mockDeleteCourseUseCase.execute.mockResolvedValue(mockResponse);

            const result = await controller.deleteCourse(courseUuid, mockRequest);

            expect(result).toBeDefined();
        });
    });
});
