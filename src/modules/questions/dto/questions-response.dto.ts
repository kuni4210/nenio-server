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
  IsDate,
} from 'class-validator';

export class getMyQuestionList {
  @IsNumber()
  @ApiProperty({
    example: 12,
    description: '질문 uid',
  })
  id: number;

  @IsString()
  @ApiProperty({
    example: '여행',
    description: '태그',
  })
  tag: string;

  @IsString()
  @ApiProperty({
    example: '지구 멸망 전의 여행지',
    description: '제목',
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: '지구 멸망 전에 딱 한번의 여행을 갈 수 있다고 가정할 때, 하나를 골라주세요.',
    description: '본문',
  })
  content: string;

  @IsString()
  @ApiProperty({
    example: 'normal',
    enum: ['normal', 'random'],
    description: '질문 유형 [일반질문, 랜덤질문]',
  })
  questionType: string;

  // @IsString()
  // @ApiProperty({
  //   example: 'ox',
  //   enum: ['ox', 'image', 'text'],
  //   description: '답변 유형',
  // })
  // optionType: string;

  @IsDate()
  @ApiProperty({
    example: '2023-04-05',
    description: '등록일',
  })
  createdAt: Date;

  @IsDate()
  @ApiProperty({
    example: '2023-04-05',
    description: '종료일',
  })
  endedAt: Date;

  // @IsNumber()
  // @ApiProperty({
  //   example: 12,
  //   description: '질문 참여 회원 수',
  // })
  // userCount: number;
}

export class getNormalQuestionList {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '여행',
    description: '태그',
  })
  public tag: string;
}
