import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import * as RequestDTO from './dto/questions-request.dto';
import * as ResponseDTO from './dto/questions-response.dto';
import { ApiPaginatedResponse } from '../../shared/decorators/pagination.decorator';
import { Roles, UserRole } from '../../shared/roles/user.role';
import { FirebaseAuthGuard } from '../../shared/guards/firebase-auth.guard';
import { ApiHeaderToken } from '../../shared/decorators/header-token.decorator';

@ApiTags('Question')
@Controller('api/question')
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @ApiOperation({ summary: '질문 등록' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Post('/create')
  async createQuestion(@Body() body: RequestDTO.createQuestionBody, @Req() req: any, @Res() res: any) {
    await this.questionService.createQuestion(body, req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '질문 수정' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'question/not-found: 요청한 question이 본인이 등록하지 않았거나 db에 없는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @ApiBadRequestResponse({ description: 'question/answer-related-to-question-registered: 요청한 question의 답변이 등록된 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Put('/:questionId')
  async updateQuestion(
    @Param() param: RequestDTO.updateQuestionParam,
    @Body() body: RequestDTO.updateQuestionBody,
    @Req() req: any,
    @Res() res: any,
  ) {
    await this.questionService.updateQuestion(param, body, req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '질문 삭제' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'question/not-found: 요청한 question이 본인이 등록하지 않았거나 db에 없는 경우' })
  @ApiBadRequestResponse({ description: 'question/answer-related-to-question-registered: 요청한 question의 답변이 등록된 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Delete('/:questionId')
  async deleteQuestion(@Param() param: RequestDTO.deleteQuestionParam, @Req() req: any, @Res() res: any) {
    await this.questionService.deleteQuestion(param, req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '질문 참여' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiBadRequestResponse({ description: 'user/already-participated: question에 이미 참여한 경우' })
  @ApiNotFoundResponse({ description: 'question/not-found: 요청한 question이 db에 없는 경우' })
  @ApiNotFoundResponse({ description: 'option/not-found: 요청한 option이 db에 없는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Post('/participate/:questionId')
  async participateQuestion(
    @Param() param: RequestDTO.participateQuestionParam,
    @Body() body: RequestDTO.participateQuestionBody,
    @Req() req: any,
    @Res() res: any,
  ) {
    await this.questionService.participateQuestion(param, body, req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '내 질문 리스트 조회' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiOkResponse({
    description: 'success',
    type: ResponseDTO.getMyQuestionList,
  })
  @Roles(UserRole.USER)
  @UseGuards(FirebaseAuthGuard)
  @Get('/list/my')
  async getMyQuestionList(@Query() query: RequestDTO.getMyQuestionListQuery, @Req() req: any, @Res() res: any) {
    let data;
    if (query.listType === 'participated') {
      data = await this.questionService.getParticipatedQuestionList(query, req.user);
    } else {
      data = await this.questionService.getRegisteredQuestionList(query, req.user);
    }
    return res.status(200).send({ message: 'success', data: data });
  }

  @ApiOperation({ summary: '큐 질문 리스트 조회' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Get('/queue/list')
  async getNormalQuestionList(@Query() query: RequestDTO.getNormalQuestionListQuery, @Req() req: any, @Res() res: any) {
    let data = await this.questionService.getNormalQuestionList(query, req.user);
    return res.status(200).send({ message: 'success', data: data });
  }

  @ApiOperation({ summary: '스낵큐 질문 리스트 조회' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Get('/snack-queue/list')
  async getRandomQuestionList(@Req() req: any, @Res() res: any) {
    let data = await this.questionService.getRandomQuestionList(req.user);
    return res.status(200).send({ message: 'success', data: data });
  }

  @ApiOperation({ summary: '질문 상세 조회' })
  @ApiHeaderToken()
  @ApiNotFoundResponse({ description: 'question/not-found: 요청한 question이 db에 없는 경우' })
  @Get('/:questionId')
  async getQuestion(@Param() param: RequestDTO.getQuestionParam, @Res() res: any) {
    const data = await this.questionService.getQuestion(param);
    return res.status(200).send({ message: 'success', data: data });
  }

  @Post('/test')
  async test(@Res() res: any, @Req() req: any) {
    const data = await this.questionService.test();
    return res.status(200).send({ message: 'success', data: data });
  }
}
