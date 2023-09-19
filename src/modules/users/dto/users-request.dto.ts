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

export class joinUserBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'kakao',
    description: '가입 플랫폼',
    enum: ['kakao', 'apple'],
  })
  public platform: string;

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

export class updateUserBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({
    type: String,
    nullable: true,
    example: '홍길동',
    description: '닉네임',
  })
  public nickname: string;

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
  @ApiProperty({
    type: [String],
    nullable: true,
    example: '["여행", "연애", "회사"]',
    description: '태그 리스트',
  })
  public tags: string[];
}

export class checkUserNicknameDuplicateBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({
    type: String,
    example: '홍길동',
    description: '닉네임',
  })
  public nickname: string;
}

export class getUserProfilePictureListQuery {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    type: [String],
    example: '["1", "2", "5"]',
    description: '회원 uid 리스트',
  })
  public userIds: string[];
}
