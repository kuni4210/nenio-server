import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createTag {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({
    example: '여행',
    description: '태그 이름',
    required: true,
  })
  public content: string;
}
