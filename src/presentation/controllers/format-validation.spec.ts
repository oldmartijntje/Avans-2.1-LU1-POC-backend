/**
 * Format Validation Tests
 * These tests validate that API responses match the expected format as defined in formatting issue.md
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { CourseController } from './course.controller';
import { SubjectsController } from './subjects.controller';
import { DisplayTextController } from './display-text.controller';
import {
    ListTagsUseCase,
    GetTagUseCase,
    CreateTagUseCase,
    DeleteTagUseCase
} from '../../application/use-cases/tag';
import {
    GetCourseUseCase,
    ListCoursesUseCase,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
} from '../../application/use-cases/course';
import {
    GetSubjectUseCase,
    ListSubjectsUseCase,
    CreateSubjectUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase,
    AddFavouriteUseCase,
    RemoveFavouriteUseCase,
    GetFavouritesUseCase,
    GetRecommendedSubjectsUseCase,
} from '../../application/use-cases/subject';
import {
    ListDisplayTextsUseCase,
    GetDisplayTextUseCase,
    GetDisplayTextByUiKeyUseCase,
    CreateDisplayTextUseCase,
    UpdateDisplayTextUseCase,
    DeleteDisplayTextUseCase,
    FindUnusedDisplayTextsUseCase,
    DeleteDuplicatesUseCase,
    FindUiElementsUseCase,
    FindAllByUiKeysUseCase,
    DeleteUnusedUseCase,
    MassUpdateUseCase,
} from '../../application/use-cases/display-text';
import { GetUserUseCase } from '../../application/use-cases/user';
import {
    JoinStudyUseCase,
    LeaveStudyUseCase,
    GetJoinedStudyUseCase,
} from '../../application/use-cases/course';
import { AuthGuard } from '../../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('API Format Validation', () => {
    let tagController: TagController;
    let courseController: CourseController;
    let subjectsController: SubjectsController;
    let displayTextController: DisplayTextController;

    // Mock use cases for Tag
    const mockListTagsUseCase = { execute: jest.fn() };
    const mockGetTagUseCase = { execute: jest.fn() };
    const mockCreateTagUseCase = { execute: jest.fn() };
    const mockDeleteTagUseCase = { execute: jest.fn() };

    // Mock use cases for Course
    const mockGetCourseUseCase = { execute: jest.fn() };
    const mockListCoursesUseCase = { execute: jest.fn() };
    const mockCreateCourseUseCase = { execute: jest.fn() };
    const mockUpdateCourseUseCase = { execute: jest.fn() };
    const mockDeleteCourseUseCase = { execute: jest.fn() };
    const mockJoinStudyUseCase = { execute: jest.fn() };
    const mockLeaveStudyUseCase = { execute: jest.fn() };
    const mockGetJoinedStudyUseCase = { execute: jest.fn() };

    // Mock use cases for Subject
    const mockGetSubjectUseCase = { execute: jest.fn() };
    const mockListSubjectsUseCase = { execute: jest.fn() };
    const mockCreateSubjectUseCase = { execute: jest.fn() };
    const mockUpdateSubjectUseCase = { execute: jest.fn() };
    const mockDeleteSubjectUseCase = { execute: jest.fn() };
    const mockAddFavouriteUseCase = { execute: jest.fn() };
    const mockRemoveFavouriteUseCase = { execute: jest.fn() };
    const mockGetFavouritesUseCase = { execute: jest.fn() };
    const mockGetRecommendedSubjectsUseCase = { execute: jest.fn() };

    // Mock use cases for DisplayText
    const mockListDisplayTextsUseCase = { execute: jest.fn() };
    const mockGetDisplayTextUseCase = { execute: jest.fn() };
    const mockGetDisplayTextByUiKeyUseCase = { execute: jest.fn() };
    const mockCreateDisplayTextUseCase = { execute: jest.fn() };
    const mockUpdateDisplayTextUseCase = { execute: jest.fn() };
    const mockDeleteDisplayTextUseCase = { execute: jest.fn() };
    const mockFindUnusedDisplayTextsUseCase = { execute: jest.fn() };
    const mockDeleteDuplicatesUseCase = { execute: jest.fn() };
    const mockFindUiElementsUseCase = { execute: jest.fn() };
    const mockFindAllByUiKeysUseCase = { execute: jest.fn() };
    const mockDeleteUnusedUseCase = { execute: jest.fn() };
    const mockMassUpdateUseCase = { execute: jest.fn() };
    const mockGetUserUseCase = { execute: jest.fn() };

    const mockJwtService = { verifyAsync: jest.fn(), sign: jest.fn() };
    const mockRequest = { user: { sub: 'user-uuid' } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TagController, CourseController, SubjectsController, DisplayTextController],
            providers: [
                // Tag providers
                { provide: ListTagsUseCase, useValue: mockListTagsUseCase },
                { provide: GetTagUseCase, useValue: mockGetTagUseCase },
                { provide: CreateTagUseCase, useValue: mockCreateTagUseCase },
                { provide: DeleteTagUseCase, useValue: mockDeleteTagUseCase },
                // Course providers
                { provide: GetCourseUseCase, useValue: mockGetCourseUseCase },
                { provide: ListCoursesUseCase, useValue: mockListCoursesUseCase },
                { provide: CreateCourseUseCase, useValue: mockCreateCourseUseCase },
                { provide: UpdateCourseUseCase, useValue: mockUpdateCourseUseCase },
                { provide: DeleteCourseUseCase, useValue: mockDeleteCourseUseCase },
                { provide: JoinStudyUseCase, useValue: mockJoinStudyUseCase },
                { provide: LeaveStudyUseCase, useValue: mockLeaveStudyUseCase },
                { provide: GetJoinedStudyUseCase, useValue: mockGetJoinedStudyUseCase },
                // Subject providers
                { provide: GetSubjectUseCase, useValue: mockGetSubjectUseCase },
                { provide: ListSubjectsUseCase, useValue: mockListSubjectsUseCase },
                { provide: CreateSubjectUseCase, useValue: mockCreateSubjectUseCase },
                { provide: UpdateSubjectUseCase, useValue: mockUpdateSubjectUseCase },
                { provide: DeleteSubjectUseCase, useValue: mockDeleteSubjectUseCase },
                { provide: AddFavouriteUseCase, useValue: mockAddFavouriteUseCase },
                { provide: RemoveFavouriteUseCase, useValue: mockRemoveFavouriteUseCase },
                { provide: GetFavouritesUseCase, useValue: mockGetFavouritesUseCase },
                { provide: GetRecommendedSubjectsUseCase, useValue: mockGetRecommendedSubjectsUseCase },
                // DisplayText providers
                { provide: ListDisplayTextsUseCase, useValue: mockListDisplayTextsUseCase },
                { provide: GetDisplayTextUseCase, useValue: mockGetDisplayTextUseCase },
                { provide: GetDisplayTextByUiKeyUseCase, useValue: mockGetDisplayTextByUiKeyUseCase },
                { provide: CreateDisplayTextUseCase, useValue: mockCreateDisplayTextUseCase },
                { provide: UpdateDisplayTextUseCase, useValue: mockUpdateDisplayTextUseCase },
                { provide: DeleteDisplayTextUseCase, useValue: mockDeleteDisplayTextUseCase },
                { provide: FindUnusedDisplayTextsUseCase, useValue: mockFindUnusedDisplayTextsUseCase },
                { provide: DeleteDuplicatesUseCase, useValue: mockDeleteDuplicatesUseCase },
                { provide: FindUiElementsUseCase, useValue: mockFindUiElementsUseCase },
                { provide: FindAllByUiKeysUseCase, useValue: mockFindAllByUiKeysUseCase },
                { provide: DeleteUnusedUseCase, useValue: mockDeleteUnusedUseCase },
                { provide: MassUpdateUseCase, useValue: mockMassUpdateUseCase },
                { provide: GetUserUseCase, useValue: mockGetUserUseCase },
                // Auth providers
                { provide: JwtService, useValue: mockJwtService },
                AuthGuard,
                Reflector,
            ],
        }).compile();

        tagController = module.get<TagController>(TagController);
        courseController = module.get<CourseController>(CourseController);
        subjectsController = module.get<SubjectsController>(SubjectsController);
        displayTextController = module.get<DisplayTextController>(DisplayTextController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Tag Endpoints Format', () => {
        it('GET /tag should return _id and __v fields', async () => {
            const expectedTags = [
                {
                    _id: '68f0c8c484d21988f4d62748',
                    tagName: 'test',
                    __v: 0
                },
                {
                    _id: '68f0c8c484d21988f4d6274a',
                    tagName: 'mongodb',
                    __v: 0
                }
            ];

            mockListTagsUseCase.execute.mockResolvedValue(expectedTags);

            const result = await tagController.findAll(mockRequest);

            expect(result).toHaveLength(2);
            result.forEach(tag => {
                expect(tag).toHaveProperty('_id');
                expect(tag).toHaveProperty('tagName');
                expect(tag).toHaveProperty('__v');
                expect(tag).not.toHaveProperty('id');
            });
        });
    });

    describe('Course Endpoints Format', () => {
        it('POST /course should return nested title/description/tags objects with _id and __v', async () => {
            const expectedCourse = {
                _id: '694a779070f5bba24b3aa46f',
                uuid: '7ec32e82-61d7-4f58-93af-f1b3c769aaa8',
                title: {
                    _id: '68f9035b7d954953ea6be77d',
                    dutch: 'Kunstacademie',
                    creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                    english: 'Art Academy',
                    __v: 0
                },
                description: {
                    _id: '68f9035b7d954953ea6be774',
                    dutch: 'Een creatieve studie',
                    creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                    english: 'A creative study',
                    __v: 0
                },
                languages: ['NL', 'EN'],
                tags: [
                    {
                        _id: '68f9035b7d954953ea6be776',
                        tagName: 'sculpture',
                        __v: 0
                    }
                ],
                __v: 0
            };

            mockCreateCourseUseCase.execute.mockResolvedValue(expectedCourse);

            const result = await courseController.create({
                titleNL: 'Kunstacademie',
                titleEN: 'Art Academy',
                descriptionNL: 'Een creatieve studie',
                descriptionEN: 'A creative study',
                languages: ['NL', 'EN'],
                tags: ['sculpture']
            }, mockRequest);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('tags');
            expect(result).toHaveProperty('__v');

            // Check nested title object
            expect(result.title).toBeInstanceOf(Object);
            expect(result.title).toHaveProperty('_id');
            expect(result.title).toHaveProperty('dutch');
            expect(result.title).toHaveProperty('english');
            expect(result.title).toHaveProperty('__v');
            expect(result.title).not.toHaveProperty('id');

            // Check nested description object
            expect(result.description).toBeInstanceOf(Object);
            expect(result.description).toHaveProperty('_id');
            expect(result.description).toHaveProperty('dutch');
            expect(result.description).toHaveProperty('english');
            expect(result.description).toHaveProperty('__v');

            // Check tags array contains objects, not strings
            expect(Array.isArray(result.tags)).toBe(true);
            if (result.tags.length > 0) {
                result.tags.forEach(tag => {
                    expect(tag).toBeInstanceOf(Object);
                    expect(tag).toHaveProperty('_id');
                    expect(tag).toHaveProperty('tagName');
                    expect(tag).toHaveProperty('__v');
                });
            }
        });

        it('DELETE /course/:uuid should return success message, not boolean', async () => {
            const expectedResponse = { message: 'Subject deleted successfully' };
            mockDeleteCourseUseCase.execute.mockResolvedValue(expectedResponse);

            const result = await courseController.deleteCourse('test-uuid', mockRequest);

            expect(result).toBeInstanceOf(Object);
            expect(result).toHaveProperty('message');
            expect(result.message).toBe('Subject deleted successfully');
            expect(typeof result).not.toBe('boolean');
        });
    });

    describe('Subject Endpoints Format', () => {
        it('GET /subjects/:uuid should return nested objects with _id and __v', async () => {
            const expectedSubject = {
                _id: '68f901267d954953ea6bde93',
                uuid: '71b11e94-e4e9-4526-9c62-7850fcedbeea',
                title: {
                    _id: '68f901257d954953ea6bde8e',
                    dutch: 'Mobiele Applicatie Ontwikkeling',
                    english: 'Mobile Application Development',
                    creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                    __v: 0
                },
                description: {
                    _id: '68f901257d954953ea6bde87',
                    dutch: 'Leer mobiele apps bouwen',
                    english: 'Learn to build mobile apps',
                    creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                    __v: 0
                },
                ownerUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                level: 'NLQF-6',
                studyPoints: 5,
                moreInfo: {
                    _id: '68f901267d954953ea6bde91',
                    dutch: 'Deze module behandelt',
                    english: 'This module covers',
                    creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                    __v: 0
                },
                languages: ['NL', 'EN'],
                tags: [
                    {
                        _id: '68f278c4074d145b14692152',
                        tagName: 'frontend',
                        __v: 0
                    }
                ],
                __v: 0,
                isFavourite: false
            };

            mockGetSubjectUseCase.execute.mockResolvedValue(expectedSubject);

            const result = await subjectsController.findOne('71b11e94-e4e9-4526-9c62-7850fcedbeea');

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('moreInfo');
            expect(result).toHaveProperty('tags');
            expect(result).toHaveProperty('__v');

            // Verify nested objects are proper objects, not strings
            expect(result.title).toBeInstanceOf(Object);
            expect(result.title).toHaveProperty('_id');
            expect(result.description).toBeInstanceOf(Object);
            expect(result.description).toHaveProperty('_id');
            expect(result.moreInfo).toBeInstanceOf(Object);
            expect(result.moreInfo).toHaveProperty('_id');
        });

        it('DELETE /subjects/:uuid should return success message, not boolean', async () => {
            const expectedResponse = { message: 'Subject deleted successfully' };
            mockDeleteSubjectUseCase.execute.mockResolvedValue(expectedResponse);

            const result = await subjectsController.deleteSubject('test-uuid', mockRequest);

            expect(result).toBeInstanceOf(Object);
            expect(result).toHaveProperty('message');
            expect(result.message).toBe('Subject deleted successfully');
        });
    });

    describe('DisplayText Endpoints Format', () => {
        it('GET /display-text should return _id and __v fields, not id', async () => {
            const expectedDisplayText = {
                _id: '694a9f6a70f5bba24b3aa5e3',
                dutch: 'test.text (nieuw)',
                creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                english: 'test.text (new)',
                uiKey: 'test.text',
                __v: 0
            };

            mockGetDisplayTextByUiKeyUseCase.execute.mockResolvedValue(expectedDisplayText);
            mockGetUserUseCase.execute.mockResolvedValue({ role: 'ADMIN' });

            const result = await displayTextController.findOne('test.text', mockRequest);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('__v');
            expect(result).not.toHaveProperty('id');
            expect(result).toHaveProperty('dutch');
            expect(result).toHaveProperty('english');
            expect(result).toHaveProperty('uiKey');
        });

        it('PATCH /display-text/:key should return _id and __v fields', async () => {
            const expectedDisplayText = {
                _id: '694a9f6a70f5bba24b3aa5e3',
                dutch: 'e',
                creatorUuid: '169ad315-039c-4d10-8cde-a0ae5c449d20',
                english: 'e',
                uiKey: 'test.text',
                __v: 0
            };

            mockGetDisplayTextByUiKeyUseCase.execute.mockResolvedValue({ id: '694a9f6a70f5bba24b3aa5e3' });
            mockUpdateDisplayTextUseCase.execute.mockResolvedValue(expectedDisplayText);

            const result = await displayTextController.update('test.text', { dutch: 'e', english: 'e' }, mockRequest);

            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('__v');
            expect(result).not.toHaveProperty('id');
        });
    });
});
