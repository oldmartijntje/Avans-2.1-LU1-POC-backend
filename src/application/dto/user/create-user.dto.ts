import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { UserRole } from "../../../domain/entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9_]+$/, {
        message: 'Username may only contain lowercase letters, numbers and underscore (_)',
    })
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole, {
        message: "Valid role required"
    })
    role: UserRole;
}
