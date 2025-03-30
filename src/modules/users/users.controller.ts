import { BadRequestException, Body, Controller, Delete, Get, Headers, NotFoundException, Patch, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import * as DTO from './users.dto';
import { ApiHeaderToken } from '../../shared/decorators/header-token.decorator';
import { FirebaseAuthGuard } from '../../shared/guards/firebase-auth.guard';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../../shared/entities/Tag.entity';

@ApiTags('User')
@Controller('api/user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly tagService: TagsService,
  ) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiBadRequestResponse({ description: 'tag/length-must-be-at-least-3' })
  @Post('/join')
  async joinUser(@Headers() header: any, @Body() body: DTO.joinUserBody, @Res() res: any) {
    let token: string;
    if (body.platform === 'kakao') {
      token = await this.userService.getUserKakaoToken(header.token);
    } else {
      token = await this.userService.getUserGeneralToken(header.token);
    }

    const tags: Tag[] = await this.tagService.getTagsByNames(body.tags)
    if (tags?.length < 3) throw new BadRequestException('tag/length-must-be-at-least-3');

    await this.userService.createUser(body.nickname, body.email, body.image, token, tags);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '회원 수정' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiBadRequestResponse({ description: 'tag/length-must-be-at-least-3' })
  @UseGuards(FirebaseAuthGuard)
  @Put()
  async updateUser(@Body() body: DTO.updateUserBody, @Req() req: any, @Res() res: any) {
    const tags: Tag[] = await this.tagService.getTagsByNames(body.tags)
    if (tags?.length < 3) throw new BadRequestException('tag/length-must-be-at-least-3');

    await this.userService.updateUser(body.nickname, body.image, tags, req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Delete()
  async deleteUser(@Req() req: any, @Res() res: any) {
    await this.userService.deleteUser(req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '회원 상세 조회' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getUser(@Req() req: any, @Res() res: any) {
    const userData = await this.userService.getUser(req.user);
    if (!userData) throw new NotFoundException('user/tag-not-found');

    return res.status(200).send({ message: 'success', data: userData });
  }

  @ApiOperation({ summary: '회원 닉네임 중복 확인' })
  @Post('/nickname/check')
  async checkUserNicknameDuplicate(@Body() body: DTO.checkUserNicknameDuplicateBody, @Res() res: any) {
    const data = await this.userService.checkUserNicknameDuplicate(body);
    return res.status(200).send({ message: 'success', data: data });
  }

  @ApiOperation({ summary: '랜덤 닉네임 생성' })
  @Get('/nickname')
  async getUserRandomNickname(@Res() res: any) {
    const data = await this.userService.getUserRandomNickname();
    return res.status(200).send({ message: 'success', data: data });
  }

  @ApiOperation({ summary: '회원 프로필 사진 리스트 조회 (삭제 예정)' })
  @Get('/profile-picture')
  async getUserProfilePictureList(@Query() query: DTO.getUserProfilePictureListQuery, @Res() res: any) {
    const data = await this.userService.getUserRandomNickname();
    return res.status(200).send({ message: 'success', data: data });
  }
}
