import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty()
    name: string;
}
