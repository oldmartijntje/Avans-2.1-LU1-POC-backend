import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
    @IsString()
    @IsNotEmpty()
    dutch: string;

    @IsString()
    @IsNotEmpty()
    english: string;
}

export class AddSubjectDto {
    @ValidateNested()
    @Type(() => TranslationDto)
    title: TranslationDto;

    @ValidateNested()
    @Type(() => TranslationDto)
    description: TranslationDto;

    @IsEnum(['NLQF-5', 'NLQF-6'], {
        message: 'level must be either NLQF-5 or NLQF-6',
    })
    level: 'NLQF-5' | 'NLQF-6';

    @IsNumber()
    studyPoints: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    languages: string[];

    @ValidateNested()
    @Type(() => TranslationDto)
    moreInfo: TranslationDto;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    tags: string[];
}
