import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CourseService } from './course.service';
import { Course } from './schema/course.schema';
import { UsersService } from '../users/users.service';
import { TagService } from '../tag/tag.service';
import { DisplayTextService } from '../display-text/display-text.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { GetUserUseCase } from '../application/use-cases/user/get-user.use-case';

describe('CourseService', () => {
    let service: CourseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CourseService,
                {
                    provide: getModelToken(Course.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
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
                    provide: TagService,
                    useValue: {
                        lookupByName: jest.fn(),
                    },
                },
                {
                    provide: DisplayTextService,
                    useValue: {
                        createDisplayTextsFromDto: jest.fn(),
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

        service = module.get<CourseService>(CourseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
