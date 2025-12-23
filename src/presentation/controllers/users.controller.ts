import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseUUIDPipe, ValidationPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AllowAnon } from '../../auth/auth.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateUserDto } from '../../application/dto/user/create-user.dto';
import { UpdateUserDto } from '../../application/dto/user/update-user.dto';
import {
    GetUserUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase
} from '../../application/use-cases/user';

@Controller('users')
export class UsersController {
    constructor(
        private readonly getUserUseCase: GetUserUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase
    ) { }

    @Get()
    async findAll(@Query('role') role?: 'TEACHER' | 'STUDENT' | 'ADMIN') {
        return await this.listUsersUseCase.execute(role);
    }

    @AllowAnon()
    @Get(':uuid')
    async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return await this.getUserUseCase.execute(uuid);
    }

    @Post()
    async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return await this.createUserUseCase.execute(createUserDto);
    }

    @Patch(':uuid')
    @UseGuards(AuthGuard)
    async update(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @Request() req
    ) {
        // Business rule: only user can change their own password
        if (updateUserDto['password']) {
            const requesterUuid = req.user?.sub;
            if (!requesterUuid || requesterUuid !== uuid) {
                throw new ForbiddenException('You can only change your own password');
            }
        }
        return await this.updateUserUseCase.execute(uuid, updateUserDto);
    }

    @Delete(':uuid')
    async delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        return await this.deleteUserUseCase.execute(uuid);
    }
}
