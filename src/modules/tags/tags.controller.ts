import { Body, Controller, Get, Header, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import * as DTO from './tags.dto';
import { Roles, UserRole } from '../../shared/roles/user.role';
import { FirebaseAuthGuard } from '../../shared/guards/firebase-auth.guard';
import { Tag } from '../../shared/entities/Tag.entity';
import { ApiHeaderToken } from '../../shared/decorators/header-token.decorator';

@ApiTags('Tag')
@Controller('api/tag')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @ApiOperation({ summary: '태그 등록' })
  @ApiHeaderToken()
  @Roles(UserRole.ADMIN)
  @UseGuards(FirebaseAuthGuard)
  @Post('/create')
  async createTag(@Body() body: DTO.createTagBody, @Res() res: any) {
    await this.tagService.createTag(body);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '태그 리스트 조회' })
  @ApiOkResponse({ description: 'success', type: DTO.getAllTagListResponse })
  @Get('/list')
  async getAllTagList(@Res() res: any) {
    let tags: Tag[] = await this.tagService.getAllTagList();
    return res.status(200).send({ message: 'success', data: tags });
  }

  @ApiOperation({ summary: '질문 많은 태그 5개 리스트 조회' })
  @ApiOkResponse({ description: 'success', type: DTO.getAllTagListResponse })
  @Get('/best/list')
  async getBestTagList(@Res() res: any) {
    let tags: Tag[] = await this.tagService.getAllTagList();
    return res.status(200).send({ message: 'success', data: tags });
  }
}
