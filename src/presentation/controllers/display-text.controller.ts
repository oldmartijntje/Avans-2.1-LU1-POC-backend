import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AllowAnon } from '../../auth/auth.decorator';
import { AuthGuard } from '../../auth/auth.guard';
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
    MassUpdateUseCase
} from '../../application/use-cases/display-text';
import { GetUserUseCase } from '../../application/use-cases/user';
import { CreateDisplayTextDto } from '../../application/dto/display-text/create-display-text.dto';
import { UpdateDisplayTextDto } from '../../application/dto/display-text/update-display-text.dto';
import { GetDisplayTextsDto } from '../../display-text/dto/get-display-texts.dto';
import { MassUpdateDisplayTextDto } from '../../display-text/dto/mass-update-display-text.dto';

@Controller('display-text')
@UseGuards(AuthGuard)
export class DisplayTextController {
    constructor(
        private readonly listDisplayTextsUseCase: ListDisplayTextsUseCase,
        private readonly getDisplayTextUseCase: GetDisplayTextUseCase,
        private readonly getDisplayTextByUiKeyUseCase: GetDisplayTextByUiKeyUseCase,
        private readonly createDisplayTextUseCase: CreateDisplayTextUseCase,
        private readonly updateDisplayTextUseCase: UpdateDisplayTextUseCase,
        private readonly deleteDisplayTextUseCase: DeleteDisplayTextUseCase,
        private readonly findUnusedDisplayTextsUseCase: FindUnusedDisplayTextsUseCase,
        private readonly deleteDuplicatesUseCase: DeleteDuplicatesUseCase,
        private readonly findUiElementsUseCase: FindUiElementsUseCase,
        private readonly findAllByUiKeysUseCase: FindAllByUiKeysUseCase,
        private readonly deleteUnusedUseCase: DeleteUnusedUseCase,
        private readonly massUpdateUseCase: MassUpdateUseCase,
        private readonly getUserUseCase: GetUserUseCase,
    ) { }

    @Get()
    async findAllUiElements(@Request() req) {
        await this.deleteDuplicatesUseCase.execute();
        return this.findUiElementsUseCase.execute();
    }

    @Get('orphans')
    async findOrphans(@Request() req) {
        return this.findUnusedDisplayTextsUseCase.execute();
    }

    @Get(':key')
    @AllowAnon()
    async findOne(@Param('key') uiKey: string, @Request() req) {
        let isAdmin = false;
        try {
            const user = await this.getUserUseCase.execute(req.user?.sub);
            if (user) {
                isAdmin = user.role === "ADMIN";
            }
        } catch (e) {
            // User not found or not authenticated
        }
        return this.getDisplayTextByUiKeyUseCase.execute(uiKey, isAdmin);
    }

    @Post()
    @AllowAnon()
    async findAll(@Body(ValidationPipe) getDisplayTextsDto: GetDisplayTextsDto, @Request() req) {
        let isAdmin = false;
        let userUuid = "";
        try {
            const user = await this.getUserUseCase.execute(req.user?.sub);
            if (user) {
                isAdmin = user.role === "ADMIN";
                userUuid = user.uuid;
            }
        } catch (e) {
            // User not found or not authenticated
        }
        return this.findAllByUiKeysUseCase.execute(getDisplayTextsDto, isAdmin, userUuid);
    }

    @Delete('orphans')
    async deleteUnused(@Request() req) {
        return this.deleteUnusedUseCase.execute(req.user?.sub);
    }

    @Delete('duplicates')
    async deleteDuplicates(@Request() req) {
        await this.deleteDuplicatesUseCase.execute();
        return { success: true, message: 'Duplicates deleted successfully' };
    }

    @Patch(':key')
    async update(
        @Param('key') uiKey: string,
        @Body(ValidationPipe) updateDisplayTextDto: UpdateDisplayTextDto,
        @Request() req
    ) {
        if (!uiKey) throw new BadRequestException();
        // Get display text by uiKey first
        const displayText = await this.getDisplayTextByUiKeyUseCase.execute(uiKey, false);
        // Update using the ID
        return this.updateDisplayTextUseCase.execute(displayText.id, updateDisplayTextDto);
    }

    @Patch()
    async massUpdate(
        @Body(ValidationPipe) massUpdateDisplayTextDto: MassUpdateDisplayTextDto,
        @Request() req
    ) {
        return this.massUpdateUseCase.execute(massUpdateDisplayTextDto, req.user?.sub);
    }
}
