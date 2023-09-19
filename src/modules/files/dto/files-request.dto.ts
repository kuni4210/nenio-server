import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class uploadFilesBody {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [Object],
    isArray: true,
    description: '파일 리스트',
  })
  @Type(() => Object)
  public files: Express.Multer.File[];
}
