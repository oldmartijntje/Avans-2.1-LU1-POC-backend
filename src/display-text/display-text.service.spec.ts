import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DisplayTextService } from './display-text.service';
import { DisplayText } from './schemas/display-text.schema';
import { Subject } from '../subjects/schemas/subject.schema';
import { Course } from '../course/schema/course.schema';
import { UsersService } from '../users/users.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { GetUserUseCase } from '../application/use-cases/user/get-user.use-case';

describe('DisplayTextService', () => {
    let service: DisplayTextService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DisplayTextService,
                {
                    provide: getModelToken(DisplayText.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Subject.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Course.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        exec: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: CaslAbilityFactory,
                    useValue: {
                        createForUser: jest.fn(),
                    },
                },
                {
                    provide: GetUserUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<DisplayTextService>(DisplayTextService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
