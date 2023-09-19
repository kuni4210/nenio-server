import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class uploadFiles {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [String],
    isArray: true,
    example: '["http://이미지url1", "http://이미지url2"]',
    description: '파일 url 리스트',
  })
  public files: string[];
}
