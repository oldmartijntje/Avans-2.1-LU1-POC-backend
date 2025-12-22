import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateDisplayTextDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    dutch?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    english?: string;

    @IsString()
    @IsOptional()
    uiKey?: string;
}
