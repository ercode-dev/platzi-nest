import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    avatar: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
