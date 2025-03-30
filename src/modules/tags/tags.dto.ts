import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class createTagBody {
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

export class getAllTagListResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty({
    example: '여행',
  })
  public content: string;
}
