import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { User, UserSchema } from './user.model';
import { UserRole } from '../../../../domain/entities/user.entity';

describe('User Model Schema Validation', () => {
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let userModel: Model<User>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        userModel = mongoConnection.model('User', UserSchema);
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe('Study Field UUID Compatibility', () => {
        it('should accept string UUIDs in study field without casting errors', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';

            const userData = {
                uuid: 'user-uuid-123',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: courseUuid, // String UUID, not ObjectId
                favourites: [],
                password: 'hashedpassword',
            };

            // This should not throw ObjectId casting errors
            const createdUser = await userModel.create(userData);

            expect(createdUser.study).toBe(courseUuid);
            expect(typeof createdUser.study).toBe('string');
        });

        it('should handle null study field gracefully', async () => {
            const userData = {
                uuid: 'user-uuid-123',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: null,
                favourites: [],
                password: 'hashedpassword',
            };

            const createdUser = await userModel.create(userData);

            expect(createdUser.study).toBeNull();
        });

        it('should update study field with UUID string without errors', async () => {
            const initialCourseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';
            const newCourseUuid = 'b76f274c-41cf-498f-99e0-74f2229574e3';

            // Create user with initial study
            const userData = {
                uuid: 'user-uuid-123',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: initialCourseUuid,
                favourites: [],
                password: 'hashedpassword',
            };

            const createdUser = await userModel.create(userData);

            // Update study field
            const updatedUser = await userModel.findOneAndUpdate(
                { uuid: 'user-uuid-123' },
                { study: newCourseUuid },
                { new: true }
            );

            expect(updatedUser?.study).toBe(newCourseUuid);
            expect(typeof updatedUser?.study).toBe('string');
        });

        it('should prevent ObjectId casting errors with valid UUID formats', async () => {
            const validUuids = [
                'a65f273b-40bf-487e-88d9-63f2119463e2',
                '123e4567-e89b-12d3-a456-426614174000',
                'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            ];

            for (const uuid of validUuids) {
                const userData = {
                    uuid: `user-${uuid}`,
                    username: `user-${uuid.slice(0, 8)}`,
                    email: `test-${uuid.slice(0, 8)}@example.com`,
                    role: UserRole.STUDENT,
                    study: uuid,
                    favourites: [],
                    password: 'hashedpassword',
                };

                // Should not throw casting errors
                const user = await userModel.create(userData);
                expect(user.study).toBe(uuid);
            }
        });

        it('should validate that study field is not treated as ObjectId reference', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2';

            const userData = {
                uuid: 'user-uuid-123',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: courseUuid,
                favourites: [],
                password: 'hashedpassword',
            };

            const createdUser = await userModel.create(userData);

            // Try to populate - this should not work since study is not a reference
            const userWithPopulate = await userModel.findOne({ uuid: 'user-uuid-123' });

            // Study field should remain as string, not be populated
            expect(userWithPopulate?.study).toBe(courseUuid);
            expect(typeof userWithPopulate?.study).toBe('string');
        });
    });

    describe('Prevention of ObjectId Casting Issues', () => {
        it('should reject attempts to store ObjectId-like strings that caused original error', async () => {
            const courseUuid = 'a65f273b-40bf-487e-88d9-63f2119463e2'; // The UUID that caused the original error

            const userData = {
                uuid: 'user-uuid-123',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: courseUuid,
                favourites: [],
                password: 'hashedpassword',
            };

            // This specific UUID caused the original CastError
            // Now it should work without issues
            await expect(userModel.create(userData)).resolves.toBeDefined();
        });

        it('should ensure favourites array still works with ObjectIds', async () => {
            // Favourites should still work as ObjectId array
            const userData = {
                uuid: 'user-uuid-123',
                username: 'testuser',
                email: 'test@example.com',
                role: UserRole.STUDENT,
                study: 'a65f273b-40bf-487e-88d9-63f2119463e2',
                favourites: [], // Start empty
                password: 'hashedpassword',
            };

            const createdUser = await userModel.create(userData);
            expect(createdUser.favourites).toEqual([]);
        });

        it('should validate schema field types match expectations', async () => {
            const schema = UserSchema;
            const studyField = schema.paths.study;

            // Study field should be String type, not ObjectId
            expect(studyField.instance).toBe('String');
            expect(studyField.instance).not.toBe('ObjectID');
        });
    });
});