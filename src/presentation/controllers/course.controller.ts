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
} from '@nestjs/common';
import { AddCourseDto } from '../../application/dto/course/add-course.dto';
import { UpdateCourseDto } from '../../application/dto/course/update-course.dto';
import {
    GetCourseUseCase,
    ListCoursesUseCase,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    JoinStudyUseCase,
    LeaveStudyUseCase,
    GetJoinedStudyUseCase,
} from '../../application/use-cases/course';

@Controller('course')
export class CourseController {
    constructor(
        private readonly getCourseUseCase: GetCourseUseCase,
        private readonly listCoursesUseCase: ListCoursesUseCase,
        private readonly createCourseUseCase: CreateCourseUseCase,
        private readonly updateCourseUseCase: UpdateCourseUseCase,
        private readonly deleteCourseUseCase: DeleteCourseUseCase,
        private readonly joinStudyUseCase: JoinStudyUseCase,
        private readonly leaveStudyUseCase: LeaveStudyUseCase,
        private readonly getJoinedStudyUseCase: GetJoinedStudyUseCase,
    ) { }

    @Post()
    async create(
        @Body(ValidationPipe) createCourseDto: AddCourseDto,
        @Request() req,
    ) {
        return await this.createCourseUseCase.execute(
            createCourseDto,
            req.user?.sub,
        );
    }

    @Get()
    async findAll() {
        return await this.listCoursesUseCase.execute();
    }

    @Get('joined')
    async findJoined(@Request() req) {
        return this.getJoinedStudyUseCase.execute(req.user?.sub);
    }

    @Post('joined/:uuid')
    async join(@Param('uuid') uuid: string, @Request() req) {
        return this.joinStudyUseCase.execute(req.user?.sub, uuid);
    }

    @Delete('joined')
    async leave(@Request() req) {
        return this.leaveStudyUseCase.execute(req.user?.sub);
    }

    @Get(':uuid')
    async findOne(@Param('uuid') uuid: string) {
        return await this.getCourseUseCase.execute(uuid);
    }

    @Patch(':uuid')
    async update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
        @Request() req,
    ) {
        return await this.updateCourseUseCase.execute(
            uuid,
            updateCourseDto,
            req.user?.sub,
        );
    }

    @Delete(':uuid')
    async deleteCourse(@Param('uuid') uuid: string, @Request() req) {
        return await this.deleteCourseUseCase.execute(uuid, req.user?.sub);
    }
}
