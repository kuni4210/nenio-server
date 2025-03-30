import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
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

export class getUserResponse {
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

export class checkUserNicknameDuplicateResponse {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    example: true,
    description: '중복',
  })
  public isDuplicated: boolean;
}

export class getUserRandomNicknameResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    example: true,
    description: '착한 강아지',
  })
  public nickname: string;
}

export class getUserProfilePictureListResponse {
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
