
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AllowAnon } from './auth.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterUserUseCase } from '../application/use-cases/auth/register-user.use-case';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly registerUserUseCase: RegisterUserUseCase
    ) { }

    @AllowAnon()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @AllowAnon()
    @HttpCode(HttpStatus.OK)
    @Post('register')
    signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.registerUserUseCase.execute(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return { ...req.user, ... (await this.authService.getProfile(req.user?.sub)), ...{ "sub": undefined } }
    }
}
