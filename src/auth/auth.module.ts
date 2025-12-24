import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApplicationModule } from '../application/application.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as settings from '../../settings.json';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
console.log('JWT Expiration Config:', settings?.jwtExpirationMinutes);

@Module({
    imports: [
        ApplicationModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: `${settings?.jwtExpirationMinutes}m` },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ]
})

export class AuthModule { }
