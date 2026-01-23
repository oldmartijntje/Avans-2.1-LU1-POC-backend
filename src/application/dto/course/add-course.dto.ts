import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
    @IsString()
    @IsNotEmpty()
    dutch: string;

    @IsString()
    @IsNotEmpty()
    english: string;
}

export class AddCourseDto {
    @ValidateNested()
    @Type(() => TranslationDto)
    title: TranslationDto;

    @ValidateNested()
    @Type(() => TranslationDto)
    description: TranslationDto;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    languages: string[];

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    tags: string[];
}
