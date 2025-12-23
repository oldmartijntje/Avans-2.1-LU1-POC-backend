import { Test, TestingModule } from '@nestjs/testing';
import { DisplayTextController } from './display-text.controller';
import { DisplayTextService } from '../../display-text/display-text.service';
import { UsersService } from '../../users/users.service';
import { AuthGuard } from '../../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import {
    ListDisplayTextsUseCase,
    GetDisplayTextUseCase,
    GetDisplayTextByUiKeyUseCase,
    CreateDisplayTextUseCase,
    UpdateDisplayTextUseCase,
    DeleteDisplayTextUseCase,
    FindUnusedDisplayTextsUseCase,
    DeleteDuplicatesUseCase
} from '../../application/use-cases/display-text';

describe('DisplayTextController', () => {
    let controller: DisplayTextController;
    let displayTextService: DisplayTextService;
    let usersService: UsersService;

    const mockDisplayTextService = {
        findUiElements: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        massUpdate: jest.fn(),
        findUnused: jest.fn(),
        deleteUnused: jest.fn(),
        deleteDuplicates: jest.fn(),
    };

    const mockUsersService = {
        findOne: jest.fn(),
    };

    const mockJwtService = {
        verifyAsync: jest.fn(),
        sign: jest.fn(),
    };

    const mockListDisplayTextsUseCase = {
        execute: jest.fn(),
    };

    const mockGetDisplayTextUseCase = {
        execute: jest.fn(),
    };

    const mockGetDisplayTextByUiKeyUseCase = {
        execute: jest.fn(),
    };

    const mockCreateDisplayTextUseCase = {
        execute: jest.fn(),
    };

    const mockUpdateDisplayTextUseCase = {
        execute: jest.fn(),
    };

    const mockDeleteDisplayTextUseCase = {
        execute: jest.fn(),
    };

    const mockFindUnusedDisplayTextsUseCase = {
        execute: jest.fn(),
    };

    const mockDeleteDuplicatesUseCase = {
        execute: jest.fn(),
    };

    const mockRequest = {
        user: { sub: 'user-uuid' },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DisplayTextController],
            providers: [
                { provide: ListDisplayTextsUseCase, useValue: mockListDisplayTextsUseCase },
                { provide: GetDisplayTextUseCase, useValue: mockGetDisplayTextUseCase },
                { provide: GetDisplayTextByUiKeyUseCase, useValue: mockGetDisplayTextByUiKeyUseCase },
                { provide: CreateDisplayTextUseCase, useValue: mockCreateDisplayTextUseCase },
                { provide: UpdateDisplayTextUseCase, useValue: mockUpdateDisplayTextUseCase },
                { provide: DeleteDisplayTextUseCase, useValue: mockDeleteDisplayTextUseCase },
                { provide: FindUnusedDisplayTextsUseCase, useValue: mockFindUnusedDisplayTextsUseCase },
                { provide: DeleteDuplicatesUseCase, useValue: mockDeleteDuplicatesUseCase },
                { provide: DisplayTextService, useValue: mockDisplayTextService },
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
                AuthGuard,
                Reflector,
            ],
        }).compile();

        controller = module.get<DisplayTextController>(DisplayTextController);
        displayTextService = module.get<DisplayTextService>(DisplayTextService);
        usersService = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET /display-text', () => {
        it('should return array of display texts with correct structure', async () => {
            const mockDisplayTexts = [
                {
                    _id: 'id-1',
                    dutch: 'Nederlands tekst',
                    english: 'English text',
                    creatorUuid: 'creator-1',
                    uiKey: 'ui.key.one',
                },
                {
                    _id: 'id-2',
                    dutch: 'Nederlandse tekst 2',
                    english: 'English text 2',
                    creatorUuid: 'creator-2',
                    uiKey: 'ui.key.two',
                },
            ];

            mockDeleteDuplicatesUseCase.execute.mockResolvedValue({ deleted: 0 });
            mockDisplayTextService.findUiElements.mockResolvedValue(mockDisplayTexts);

            const result = await controller.findAllUiElements(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);

            result.forEach(displayText => {
                expect(displayText).toHaveProperty('dutch');
                expect(displayText).toHaveProperty('english');
                expect(displayText).toHaveProperty('creatorUuid');
                expect(typeof displayText.dutch).toBe('string');
                expect(typeof displayText.english).toBe('string');
                expect(typeof displayText.creatorUuid).toBe('string');
            });
        });
    });

    describe('GET /display-text/orphans', () => {
        it('should return array of orphaned display texts with correct structure', async () => {
            const mockOrphans = [
                {
                    _id: 'id-1',
                    dutch: 'Verweesde tekst',
                    english: 'Orphaned text',
                    creatorUuid: 'creator-1',
                },
            ];

            mockFindUnusedDisplayTextsUseCase.execute.mockResolvedValue(mockOrphans);

            const result = await controller.findOrphans(mockRequest);

            expect(Array.isArray(result)).toBe(true);
            result.forEach(displayText => {
                expect(displayText).toHaveProperty('dutch');
                expect(displayText).toHaveProperty('english');
                expect(displayText).toHaveProperty('creatorUuid');
            });
        });
    });

    describe('GET /display-text/:key', () => {
        it('should return single display text with correct structure for non-admin user', async () => {
            const uiKey = 'ui.test.key';
            const mockDisplayText = {
                _id: 'id-1',
                dutch: 'Test tekst',
                english: 'Test text',
                creatorUuid: 'creator-1',
                uiKey: uiKey,
            };

            mockUsersService.findOne.mockResolvedValue({
                uuid: 'user-uuid',
                role: 'STUDENT',
            });
            mockGetDisplayTextByUiKeyUseCase.execute.mockResolvedValue(mockDisplayText);

            const result = await controller.findOne(uiKey, mockRequest);

            expect(result).toEqual(mockDisplayText);
            expect(result).toHaveProperty('dutch');
            expect(result).toHaveProperty('english');
            expect(result).toHaveProperty('creatorUuid');
            expect(result).toHaveProperty('uiKey');
            expect(result.uiKey).toBe(uiKey);
        });

        it('should return single display text for admin user', async () => {
            const uiKey = 'ui.test.key';
            const mockDisplayText = {
                _id: 'id-1',
                dutch: 'Test tekst',
                english: 'Test text',
                creatorUuid: 'creator-1',
                uiKey: uiKey,
            };

            mockUsersService.findOne.mockResolvedValue({
                uuid: 'user-uuid',
                role: 'ADMIN',
            });
            mockGetDisplayTextByUiKeyUseCase.execute.mockResolvedValue(mockDisplayText);

            const result = await controller.findOne(uiKey, mockRequest);

            expect(result).toEqual(mockDisplayText);
        });
    });

    describe('POST /display-text', () => {
        it('should return array of display texts based on keys with correct structure', async () => {
            const getDisplayTextsDto = {
                keys: ['ui.key.one', 'ui.key.two'],
            };

            const mockDisplayTexts = [
                {
                    _id: 'id-1',
                    dutch: 'Tekst een',
                    english: 'Text one',
                    creatorUuid: 'creator-1',
                    uiKey: 'ui.key.one',
                },
                {
                    _id: 'id-2',
                    dutch: 'Tekst twee',
                    english: 'Text two',
                    creatorUuid: 'creator-2',
                    uiKey: 'ui.key.two',
                },
            ];

            mockUsersService.findOne.mockResolvedValue({
                uuid: 'user-uuid',
                role: 'TEACHER',
            });
            mockDisplayTextService.findAll.mockResolvedValue(mockDisplayTexts);

            const result = await controller.findAll(getDisplayTextsDto, mockRequest);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(2);
            result.forEach(displayText => {
                expect(displayText).toHaveProperty('dutch');
                expect(displayText).toHaveProperty('english');
                expect(displayText).toHaveProperty('uiKey');
            });
        });
    });

    describe('DELETE /display-text/orphans', () => {
        it('should delete orphaned display texts and return confirmation', async () => {
            const mockResponse = { deleted: 5 };

            mockDisplayTextService.deleteUnused.mockResolvedValue(mockResponse);

            const result = await controller.deleteUnused(mockRequest);

            expect(result).toBeDefined();
            expect(displayTextService.deleteUnused).toHaveBeenCalledWith('user-uuid');
        });
    });

    describe('DELETE /display-text/duplicates', () => {
        it('should delete duplicate display texts and return confirmation', async () => {
            const mockResponse = { deleted: 3 };

            mockDeleteDuplicatesUseCase.execute.mockResolvedValue({ deleted: 3 });

            const result = await controller.deleteDuplicates(mockRequest);

            expect(result).toBeDefined();
        });
    });

    describe('PATCH /display-text/:key', () => {
        it('should update display text and return updated display text with correct structure', async () => {
            const uiKey = 'ui.test.key';
            const updateDto = {
                dutch: 'Bijgewerkte tekst',
                english: 'Updated text',
            };

            const mockUpdatedDisplayText = {
                _id: 'id-1',
                dutch: 'Bijgewerkte tekst',
                english: 'Updated text',
                creatorUuid: 'creator-1',
                uiKey: uiKey,
            };

            mockGetDisplayTextByUiKeyUseCase.execute.mockResolvedValue({ id: 'id-1', ...mockUpdatedDisplayText });
            mockUpdateDisplayTextUseCase.execute.mockResolvedValue(mockUpdatedDisplayText);

            const result = await controller.update(uiKey, updateDto, mockRequest);

            expect(result).toEqual(mockUpdatedDisplayText);
            expect(result).toHaveProperty('dutch');
            expect(result).toHaveProperty('english');
            expect(result).toHaveProperty('uiKey');
            expect(result.dutch).toBe('Bijgewerkte tekst');
            expect(result.english).toBe('Updated text');
        });
    });

    describe('PATCH /display-text', () => {
        it('should mass update display texts and return confirmation', async () => {
            const massUpdateDto = {
                updates: [
                    { uiKey: 'key1', dutch: 'Tekst 1', english: 'Text 1' },
                    { uiKey: 'key2', dutch: 'Tekst 2', english: 'Text 2' },
                ],
            };

            const mockResponse = { updated: 2 };

            mockDisplayTextService.massUpdate.mockResolvedValue(mockResponse);

            const result = await controller.massUpdate(massUpdateDto, mockRequest);

            expect(result).toBeDefined();
            expect(displayTextService.massUpdate).toHaveBeenCalledWith(massUpdateDto, 'user-uuid');
        });
    });
});
