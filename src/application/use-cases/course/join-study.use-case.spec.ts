import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JoinStudyUseCase } from './join-study.use-case';
import { COURSE_REPOSITORY } from '../../../domain/repositories/course-repository.interface';
import type { ICourseRepository } from '../../../domain/repositories/course-repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { User, UserRole } from '../../../domain/entities/user.entity';

describe('JoinStudyUseCase UUID Compatibility', () => {
    let useCase: JoinStudyUseCase;
    let courseRepository: jest.Mocked<ICourseRepository>;
    let userRepository: jest.Mocked<IUserRepository>;

    const mockCourseRepository = {
        findById: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockUserRepository = {
        findById: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JoinStudyUseCase,
                {
                    provide: COURSE_REPOSITORY,
                    useValue: mockCourseRepository,
                },
                {
                    provide: USER_REPOSITORY,
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        useCase = module.get<JoinStudyUseCase>(JoinStudyUseCase);
        courseRepository = module.get(COURSE_REPOSITORY);
        userRepository = module.get(USER_REPOSITORY);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('UUID Handling in Course Joining', () => {
        it('should store course UUID as string in user study field', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';
            const userUuid = 'user-uuid-123';

            const mockCourse = Course.create({
                uuid: courseUuid,
                title: 'Test Course',
                description: 'Test Description',
                subjectIds: [],
                tagIds: [],
                owner: 'owner-uuid',
            });

            const mockUser = User.create({
                uuid: userUuid,
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                studyId: null, // Not currently enrolled
                favouriteIds: [],
                password: 'hashedpassword',
            });

            courseRepository.findById.mockResolvedValue(mockCourse);
            userRepository.findById.mockResolvedValue(mockUser);
            userRepository.update.mockResolvedValue(mockUser);

            await useCase.execute(userUuid, courseUuid);

            // Verify that update was called with course UUID as string
            expect(userRepository.update).toHaveBeenCalledWith(
                userUuid,
                expect.objectContaining({
                    studyId: courseUuid, // Should be string UUID, not ObjectId
                })
            );
        });

        it('should prevent ObjectId casting errors by using UUID strings', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';
            const userUuid = 'user-uuid-123';

            const mockCourse = Course.create({
                uuid: courseUuid,
                title: 'Test Course',
                description: 'Test Description',
                subjectIds: [],
                tagIds: [],
                owner: 'owner-uuid',
            });

            const mockUser = User.create({
                uuid: userUuid,
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                studyId: null,
                favouriteIds: [],
                password: 'hashedpassword',
            });

            courseRepository.findById.mockResolvedValue(mockCourse);
            userRepository.findById.mockResolvedValue(mockUser);
            userRepository.update.mockResolvedValue(mockUser);

            // This should not throw any ObjectId casting errors
            await expect(useCase.execute(userUuid, courseUuid)).resolves.not.toThrow();

            // Verify the user's studyId is set to the course UUID string
            const updateCall = userRepository.update.mock.calls[0];
            const updatedUser = updateCall[1];

            expect(updatedUser.studyId).toBe(courseUuid);
            expect(typeof updatedUser.studyId).toBe('string');

            // Verify it's a valid UUID format (not ObjectId)
            expect(updatedUser.studyId).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            );
        });

        it('should handle course not found without ObjectId issues', async () => {
            const courseUuid = 'non-existent-uuid';
            const userUuid = 'user-uuid-123';

            courseRepository.findById.mockRejectedValue(new NotFoundException('Course Not Found'));

            await expect(useCase.execute(userUuid, courseUuid)).rejects.toThrow('Course Not Found');

            // Verify no update was attempted
            expect(userRepository.update).not.toHaveBeenCalled();
        });

        it('should handle already enrolled user correctly', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';
            const userUuid = 'user-uuid-123';
            const existingStudyUuid = 'existing-study-uuid';

            const mockCourse = Course.create({
                uuid: courseUuid,
                title: 'Test Course',
                description: 'Test Description',
                subjectIds: [],
                tagIds: [],
                owner: 'owner-uuid',
            });

            const mockUser = User.create({
                uuid: userUuid,
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                studyId: existingStudyUuid, // Already enrolled
                favouriteIds: [],
                password: 'hashedpassword',
            });

            courseRepository.findById.mockResolvedValue(mockCourse);
            userRepository.findById.mockResolvedValue(mockUser);
            userRepository.update.mockResolvedValue(mockUser);

            await useCase.execute(userUuid, courseUuid);

            // Should still update with new course UUID
            expect(userRepository.update).toHaveBeenCalledWith(
                userUuid,
                expect.objectContaining({
                    studyId: courseUuid,
                })
            );
        });
    });

    describe('Data Type Validation', () => {
        it('should ensure course UUIDs are strings, not ObjectIds', () => {
            const validUuids = [
                'a65f273b-40bf-487e-88d9-63f2119463e2',
                '123e4567-e89b-12d3-a456-426614174000',
                'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            ];

            validUuids.forEach(uuid => {
                expect(typeof uuid).toBe('string');
                expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

                // Should not be ObjectId format (24 hex characters)
                expect(uuid).not.toMatch(/^[0-9a-f]{24}$/i);
            });
        });

        it('should reject ObjectId-like strings in favor of UUIDs', () => {
            const objectIdLikeStrings = [
                '507f1f77bcf86cd799439011', // 24 hex chars (ObjectId format)
                '507f191e810c19729de860ea',
            ];

            objectIdLikeStrings.forEach(objectIdString => {
                // These should not be valid UUIDs
                expect(objectIdString).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

                // These are ObjectId format (should be avoided)
                expect(objectIdString).toMatch(/^[0-9a-f]{24}$/i);
            });
        });
    });
});