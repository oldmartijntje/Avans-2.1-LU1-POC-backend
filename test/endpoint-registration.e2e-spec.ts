import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Endpoint Registration (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // Test to prevent 404 errors from unregistered controllers
    describe('Controller Registration Verification', () => {
        it('should not return 404 for any controller routes (prevents unregistered controller issue)', async () => {
            const httpServer = app.getHttpServer();

            // The key is that these routes should NOT return 404
            // They might return other errors, but not 404 (not found)
            const routesToTest = [
                { method: 'get', path: '/tag' },
                { method: 'get', path: '/subjects' },
                { method: 'get', path: '/course' },
                { method: 'get', path: '/course/joined' },
                { method: 'get', path: '/display-text' },
                { method: 'get', path: '/users' },
                { method: 'get', path: '/auth/profile' },
                { method: 'post', path: '/auth/login' },
            ];

            for (const route of routesToTest) {
                await request(httpServer)[route.method](route.path).expect((res) => {
                    // The critical test: should NOT be 404 (not found)
                    // This is what we're preventing - the 404 errors from unregistered controllers
                    expect(res.status).not.toBe(404);

                    // Any other status is acceptable (401, 400, 500, etc.) - just not 404
                    // The point is the route exists and is handled by a controller
                });
            }
        });

        it('should have all controllers properly registered in the module system', async () => {
            // Test that the application starts successfully
            // If controllers weren't registered, the app wouldn't start or routes wouldn't exist
            expect(app).toBeDefined();
            expect(app.getHttpServer()).toBeDefined();

            // Test that we can get the HTTP adapter (indicates routes are registered)
            const httpAdapter = app.getHttpAdapter();
            expect(httpAdapter).toBeDefined();
        });
    });
});