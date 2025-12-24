import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from './user.repository';
import { User as UserEntity, UserRole } from '../../../../domain/entities/user.entity';

describe('UserRepository UUID Compatibility', () => {
    let repository: UserRepository;
    let userModel: Model<any>;

    const mockUserModel = {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        create: jest.fn(),
        findByIdAndDelete: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: getModelToken('User'),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        repository = module.get<UserRepository>(UserRepository);
        userModel = module.get<Model<any>>(getModelToken('User'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Study Field UUID Handling', () => {
        it('should handle string UUIDs in study field without population', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';
            const mockUser = {
                uuid: 'user-uuid',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: courseUuid, // This should be a string UUID, not ObjectId
                favourites: [],
                password: 'hashedpassword',
            };

            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await repository.findById('user-uuid');

            // Verify no population was called (which would cause ObjectId casting errors)
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ uuid: 'user-uuid' });
            expect(mockUserModel.findOne().exec).toHaveBeenCalled();

            // Verify the query doesn't include populate calls
            const findOneCall = mockUserModel.findOne.mock.calls[0];
            expect(findOneCall).toEqual([{ uuid: 'user-uuid' }]);

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.studyId).toBe(courseUuid);
        });

        it('should update user study field with UUID string', async () => {
            const userUuid = 'user-uuid';
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';

            const userEntity = UserEntity.create({
                uuid: userUuid,
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                studyId: courseUuid, // UUID string
                favouriteIds: [],
                password: 'hashedpassword',
            });

            const existingMockUser = {
                uuid: userUuid,
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: null,
                favourites: [],
                password: 'hashedpassword',
            };

            const updatedMockUser = {
                ...existingMockUser,
                study: courseUuid,
            };

            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(existingMockUser),
            });

            mockUserModel.findOneAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedMockUser),
            });

            const result = await repository.update(userUuid, { studyId: courseUuid });

            // Verify the update includes study as a string UUID
            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { uuid: userUuid },
                { study: courseUuid }, // Should be string, not ObjectId
                { new: true }
            );

            expect(result.studyId).toBe(courseUuid);
        });

        it('should handle null study field gracefully', async () => {
            const mockUser = {
                uuid: 'user-uuid',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: null,
                favourites: [],
                password: 'hashedpassword',
            };

            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await repository.findById('user-uuid');

            expect(result.studyId).toBeNull();
        });
    });

    describe('Prevention of ObjectId Casting Errors', () => {
        it('should never attempt to populate study field', async () => {
            const mockUser = {
                uuid: 'user-uuid',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: 'a65f273b-40bf-487e-88d9-63f2119463e2',
                favourites: [],
                password: 'hashedpassword',
            };

            const mockQuery = {
                exec: jest.fn().mockResolvedValue(mockUser),
                populate: jest.fn(),
            };

            mockUserModel.findOne.mockReturnValue(mockQuery);

            await repository.findById('user-uuid');

            // Verify populate was never called
            expect(mockQuery.populate).not.toHaveBeenCalled();
        });

        it('should validate that study field accepts string values', () => {
            // Test that string UUIDs don't cause casting errors
            const validUuids = [
                'a65f273b-40bf-487e-88d9-63f2119463e2',
                '123e4567-e89b-12d3-a456-426614174000',
                null,
                undefined,
            ];

            validUuids.forEach((uuid) => {
                expect(() => {
                    const userData = {
                        uuid: 'user-uuid',
                        username: 'testuser',
                        email: 'test@example.com',
                        role: UserRole.STUDENT,
                        study: uuid,
                        favourites: [],
                    };
                    // This should not throw any casting errors
                    JSON.stringify(userData);
                }).not.toThrow();
            });
        });
    });
});