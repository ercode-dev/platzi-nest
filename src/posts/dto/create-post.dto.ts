import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    content?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    coverImage?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    summary?: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    @ApiProperty()
    categories?: number[];
}
