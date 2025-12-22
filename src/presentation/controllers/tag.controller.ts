import { Controller, Get, Post, Delete, Param, Body, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AllowAnon } from '../../auth/auth.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import {
    ListTagsUseCase,
    GetTagUseCase,
    CreateTagUseCase,
    DeleteTagUseCase
} from '../../application/use-cases/tag';
import { CreateTagDto } from '../../application/dto/tag/create-tag.dto';

@Controller('tag')
@UseGuards(AuthGuard)
export class TagController {
    constructor(
        private readonly listTagsUseCase: ListTagsUseCase,
        private readonly getTagUseCase: GetTagUseCase,
        private readonly createTagUseCase: CreateTagUseCase,
        private readonly deleteTagUseCase: DeleteTagUseCase
    ) { }

    @AllowAnon()
    @Get()
    async findAll(@Request() req) {
        return this.listTagsUseCase.execute();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getTagUseCase.execute(id);
    }

    @Post()
    async create(@Body(ValidationPipe) createTagDto: CreateTagDto, @Request() req) {
        return this.createTagUseCase.execute(createTagDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.deleteTagUseCase.execute(id);
    }
}
