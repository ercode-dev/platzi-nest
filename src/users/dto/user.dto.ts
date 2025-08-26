import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsObject()
    @Type(() => CreateProfileDto)
    @IsNotEmpty()
    @ApiProperty()
    profile: CreateProfileDto;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['profile'])) {
    @ValidateNested()
    @Type(() => UpdateProfileDto)
    @IsOptional()
    profile: UpdateProfileDto;
}
