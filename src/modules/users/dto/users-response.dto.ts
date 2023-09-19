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

export class getUser {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({
    type: String,
    example: '홍길동',
    description: '닉네임',
  })
  public nickname: string;

  @ApiProperty({
    type: String,
    nullable: true,
    // required: true,
    example: 'test@email.com',
    description: '이메일',
  })
  public email: string | null;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://이미지주소.com',
    description: '프로필 사진',
  })
  public image: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    type: [String],
    example: '["여행", "연애", "회사"]',
    description: '태그 리스트',
  })
  public tags: string[];
}

export class checkUserNicknameDuplicate {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    example: true,
    description: '중복',
  })
  public isDuplicated: boolean;
}

export class getUserRandomNickname {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    example: true,
    description: '착한 강아지',
  })
  public nickname: string;
}

export class getUserProfilePictureList {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    type: [String],
    example: '["http://이미지주소1.com", "http://이미지주소2.com", "http://이미지주소3.com"]',
    description: '이미지 주소 리스트',
  })
  public images: string[];
}
