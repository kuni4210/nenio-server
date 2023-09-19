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

export class createQuestionBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '여행',
    description: '태그',
  })
  public tag: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'normal',
    description: '질문 유형',
    enum: ['normal', 'random'],
  })
  public questionType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ox',
    description: '답변 유형',
    enum: ['ox', 'image', 'text'],
  })
  public optionType: string;

  @IsString()
  @ApiProperty({
    example: '이 질문에 대답해주세요.',
    description: '질문 제목',
  })
  public questionTitle: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '내일 가고 싶은 여행지는?',
    description: '질문 내용',
  })
  public questionContent: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '질문 이미지',
  })
  public questionImage: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    description: '종료 날짜',
  })
  public endedAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '질문1 내용',
  })
  public optionContent1: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '질문1 이미지',
  })
  public optionImage1: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '질문2 내용',
  })
  public optionContent2: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '질문2 이미지',
  })
  public optionImage2: string | null;
}

export class updateQuestionBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '여행',
    description: '태그',
  })
  public tag: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'normal',
    description: '질문 유형',
    enum: ['normal', 'random'],
  })
  public questionType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ox',
    description: '답변 유형',
    enum: ['ox', 'image', 'text'],
  })
  public optionType: string;

  @IsString()
  @ApiProperty({
    example: '이 질문에 대답해주세요.',
    description: '질문 제목',
  })
  public questionTitle: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '내일 가고 싶은 여행지는?',
    description: '질문 내용',
  })
  public questionContent: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '질문 이미지',
  })
  public questionImage: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    description: '종료 날짜',
  })
  public endedAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '질문1 내용',
  })
  public optionContent1: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '질문1 이미지',
  })
  public optionImage1: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '질문2 내용',
  })
  public optionContent2: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '질문2 이미지',
  })
  public optionImage2: string | null;
}

export class updateQuestionParam {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 13,
    description: '질문 uid',
  })
  public questionId: string | null;
}

export class deleteQuestionParam {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 13,
    description: '질문 uid',
  })
  public questionId: string | null;
}

export class participateQuestionBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '선택지 uid',
  })
  public optionId: string;
}

export class participateQuestionParam {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '질문 uid',
  })
  public questionId: string;
}

export class getMyQuestionListQuery {
  @IsString()
  @ApiProperty({
    example: '3',
    description: '페이지',
    default: '1',
  })
  public page: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'participated',
    description: 'participated: 참여한 질문 리스트 조회, registered: 등록한 질문 리스트 조회',
    enum: ['participated', 'registered'],
  })
  public listType: string;

  @IsString()
  @ApiProperty({
    example: 'true',
    description: '마감 제외 여부',
  })
  public excludeClosed: string;
}

export class getNormalQuestionListQuery {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '여행',
    description: '태그',
  })
  public tag: string;

  @IsString()
  @ApiProperty({
    example: 'true',
    description: '마감 제외 여부',
  })
  public excludeClosed: string;

  @IsString()
  @ApiProperty({
    example: 'true',
    description: '답변함 제외 여부',
  })
  public excludeAnswered: string;
}

export class getQuestionParam {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '질문 uid',
  })
  public questionId: string;
}
