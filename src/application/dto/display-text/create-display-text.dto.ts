import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateDisplayTextDto {
    @IsString()
    @IsNotEmpty()
    dutch: string;

    @IsString()
    @IsNotEmpty()
    english: string;

    @IsString()
    @IsOptional()
    uiKey?: string;
}
