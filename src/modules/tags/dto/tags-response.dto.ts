import { ApiProperty } from '@nestjs/swagger';

export class getAllTagList {
  @ApiProperty()
  public id: number;

  @ApiProperty({
    example: '여행',
  })
  public content: string;
}
