import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SubjectsService } from './subjects.service';
import { Subject } from './schemas/subject.schema';
import { UsersService } from '../users/users.service';
import { TagService } from '../tag/tag.service';
import { DisplayTextService } from '../display-text/display-text.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

describe('SubjectsService', () => {
    let service: SubjectsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubjectsService,
                {
                    provide: getModelToken(Subject.name),
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
            ],
        }).compile();

        service = module.get<SubjectsService>(SubjectsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
