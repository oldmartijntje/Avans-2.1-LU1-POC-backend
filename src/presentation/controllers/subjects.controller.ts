import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Request,
    ValidationPipe,
    Patch,
    ParseUUIDPipe,
    Delete,
    Query,
    BadRequestException,
} from '@nestjs/common';
import { AddSubjectDto } from '../../application/dto/subject/add-subject.dto';
import { UpdateSubjectDto } from '../../application/dto/subject/update-subject.dto';
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
import { AllowAnon } from '../../auth/auth.decorator';

@Controller('subjects')
export class SubjectsController {
    constructor(
        private readonly getSubjectUseCase: GetSubjectUseCase,
        private readonly listSubjectsUseCase: ListSubjectsUseCase,
        private readonly createSubjectUseCase: CreateSubjectUseCase,
        private readonly updateSubjectUseCase: UpdateSubjectUseCase,
        private readonly deleteSubjectUseCase: DeleteSubjectUseCase,
        private readonly addFavouriteUseCase: AddFavouriteUseCase,
        private readonly removeFavouriteUseCase: RemoveFavouriteUseCase,
        private readonly getFavouritesUseCase: GetFavouritesUseCase,
        private readonly getRecommendedSubjectsUseCase: GetRecommendedSubjectsUseCase,
    ) { }

    @Post()
    async create(
        @Body(ValidationPipe) createSubjectDto: AddSubjectDto,
        @Request() req,
    ) {
        return await this.createSubjectUseCase.execute(
            createSubjectDto,
            req.user?.sub,
        );
    }

    @Get('favourites')
    async getFavourites(@Request() req) {
        return this.getFavouritesUseCase.execute(req.user?.sub);
    }

    @Get('reccomended')
    async findSubjectsBySimilarTags(@Request() req) {
        return this.getRecommendedSubjectsUseCase.execute(req.user?.sub);
    }

    @Post('favourite/:uuid')
    async setFavourite(@Param('uuid') uuid: string, @Request() req) {
        return this.addFavouriteUseCase.execute(req.user?.sub, uuid);
    }

    @Delete('favourite/:uuid')
    async removeFavourite(@Param('uuid') uuid: string, @Request() req) {
        return this.removeFavouriteUseCase.execute(req.user?.sub, uuid);
    }


    @AllowAnon()
    @Get()
    async findAll(
        @Request() req,
        @Query('level') level?: 'NLQF-5' | 'NLQF-6',
        @Query('points') studyPoints?: string,
        @Query('tag') tag?: string,
    ) {
        let pointsFilter: number | undefined;
        if (studyPoints) {
            if (!isNaN(Number(studyPoints))) {
                pointsFilter = Number(studyPoints);
            } else {
                throw new BadRequestException("'points' is not a number");
            }
        }
        if (level && level != 'NLQF-5' && level != 'NLQF-6') {
            throw new BadRequestException("'level' is either 'NLQF-5' or 'NLQF-6'");
        }
        const subjects = await this.listSubjectsUseCase.execute(level, pointsFilter, tag);
        return subjects.map((s: any) => ({
            uuid: s.uuid,
            title: s.title,
            description: s.description,
            ownerUuid: s.ownerUuid,
            level: s.level,
            studyPoints: s.studyPoints,
            moreInfo: s.moreInfo,
            languages: s.languages,
            tags: Array.isArray(s.tags) ? s.tags : [],
            isFavourite: s.isFavourite,
        }));
    }


    @Get(':uuid')
    async findOne(@Param('uuid') uuid: string) {
        const s = await this.getSubjectUseCase.execute(uuid);
        if (!s) return null;
        return {
            uuid: s.uuid,
            title: s.title,
            description: s.description,
            ownerUuid: s.ownerUuid,
            level: s.level,
            studyPoints: s.studyPoints,
            moreInfo: s.moreInfo,
            languages: s.languages,
            tags: Array.isArray(s.tags) ? s.tags : [],
            isFavourite: s.isFavourite,
        };
    }

    @Patch(':uuid')
    async update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body(ValidationPipe) updateSubjectDto: UpdateSubjectDto,
        @Request() req,
    ) {
        return await this.updateSubjectUseCase.execute(
            uuid,
            updateSubjectDto,
            req.user?.sub,
        );
    }

    @Delete(':uuid')
    async deleteSubject(@Param('uuid') uuid: string, @Request() req) {
        return await this.deleteSubjectUseCase.execute(uuid, req.user?.sub);
    }
}
