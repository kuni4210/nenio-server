import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import * as DTO from './questions.dto';
import { Roles, UserRole } from '../../shared/roles/user.role';
import { FirebaseAuthGuard } from '../../shared/guards/firebase-auth.guard';
import { ApiHeaderToken } from '../../shared/decorators/header-token.decorator';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../../shared/entities/Tag.entity';
import { Question } from '../../shared/entities/Question.entity';
import { Option } from '../../shared/entities/Option.entity';
import { EntityManager } from 'typeorm';
import { TransactionManager } from '../../shared/decorators/transaction-manager.decorator';
import { TransactionInterceptor } from '../../shared/interceptors/\btransaction.interceptor';

@ApiTags('Question')
@Controller('api/question')
export class QuestionsController {
  constructor(
    private readonly questionService: QuestionsService,
    private readonly tagService: TagsService
  ) {}

  @ApiOperation({ summary: '질문 등록' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Post('/create')
  async createQuestion(@Body() body: DTO.createQuestionBody, @Req() req: any, @Res() res: any) {
    // 태그 확인
    const tag: Tag = await this.tagService.getOneTagByName(body.tag);
    if (!tag) throw new NotFoundException('tag/not-found');

    // 질문 등록
    await this.questionService.createQuestion(
      body.questionType,
      body.optionType,
      body.questionContent,
      body.questionImage,
      body.endedAt,
      body.optionContent1,
      body.optionImage1,
      body.optionContent2,
      body.optionImage2,
      tag,
      req.user
    );

    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '질문 수정' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'question/not-found: 요청한 question이 본인이 등록하지 않았거나 db에 없는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @ApiBadRequestResponse({ description: 'question/answer-related-to-question-registered: 요청한 question의 답변이 이미 등록된 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Put('/:questionId')
  async updateQuestion(
    @Param() param: DTO.updateQuestionParam,
    @Body() body: DTO.updateQuestionBody,
    @Req() req: any,
    @Res() res: any,
  ) {
    // 질문 권한 확인
    const question: Question = await this.questionService.findOneQuestionByIdAndUserId(parseInt(param.questionId, 10), req.user.id)
    if (!question) throw new NotFoundException('question/not-found');
    if (question.participants.length > 0) throw new BadRequestException('qustion/answers-related-to-question-registered');

    // 태그 확인
    const tag: Tag = await this.tagService.getOneTagByName(body.tag);
    if (!tag) throw new NotFoundException('tag/not-found');
      
    // 수정
    await this.questionService.updateQuestion(      
      body.questionType,
      body.optionType,
      body.questionContent,
      body.questionImage,
      body.endedAt,
      body.optionContent1,
      body.optionImage1,
      body.optionContent2,
      body.optionImage2,
      tag,
      question,
      req.user
    );

    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '질문 삭제' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'question/not-found: 요청한 question이 본인이 등록하지 않았거나 db에 없는 경우' })
  @ApiBadRequestResponse({ description: 'question/answer-related-to-question-registered: 요청한 question의 답변이 등록된 경우' })
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('/:questionId')
  async deleteQuestion(
    @Param() param: DTO.deleteQuestionParam,
    @Req() req: any,
    @Res() res: any,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    // 질문 권한 확인
    const question: Question = await this.questionService.findOneQuestionByIdAndUserId(parseInt(param.questionId, 10), req.user.id)
    if (!question) throw new NotFoundException('question/not-found');
    if (question.participants.length > 0) throw new BadRequestException('qustion/answers-related-to-question-registered');
    
    // 질문 삭제
    await this.questionService.deleteQuestion(parseInt(param.questionId), transactionManager);

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
    @Param() param: DTO.participateQuestionParam,
    @Body() body: DTO.participateQuestionBody,
    @Req() req: any,
    @Res() res: any,
  ) {
    // 질문 권한 확인
    const question: Question = await this.questionService.findOneQuestionByIdAndUserId(parseInt(param.questionId, 10), req.user.id)
    if (!question) throw new NotFoundException('question/not-found');
    if (question.participants.length > 0) throw new BadRequestException('qustion/answers-related-to-question-registered');
    
    // 옵션 확인
    const option: Option = await this.questionService.getOneOptionById(parseInt(body.optionId, 10))
    if (!option) throw new NotFoundException('option/not-found');

    // 질문 참여
    await this.questionService.participateQuestion(option, question, req.user);
    return res.status(200).send({ message: 'success' });
  }

  @ApiOperation({ summary: '내 질문 리스트 조회' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiOkResponse({
    description: 'success',
    type: DTO.getMyQuestionListResponse,
  })
  @Roles(UserRole.USER)
  @UseGuards(FirebaseAuthGuard)
  @Get('/list/my')
  async getMyQuestionList(@Query() query: DTO.getMyQuestionListQuery, @Req() req: any, @Res() res: any) {
    let data;
    if (query.listType === 'participated') {
      data = await this.questionService.getParticipatedQuestionList(query.excludeClosed, req.user);
    } else {
      data = await this.questionService.getRegisteredQuestionList(query.excludeClosed, req.user);
    }
    return res.status(200).send({ message: 'success', data: data });
  }

  @ApiOperation({ summary: '큐 질문 리스트 조회' })
  @ApiHeaderToken()
  @ApiForbiddenResponse({ description: 'user/permission-denied: 파이어베이스 인증시 문제가 있는 경우' })
  @ApiNotFoundResponse({ description: 'tag/not-found: 요청한 tag가 db에 없는 경우' })
  @UseGuards(FirebaseAuthGuard)
  @Get('/queue/list')
  async getNormalQuestionList(@Query() query: DTO.getNormalQuestionListQuery, @Req() req: any, @Res() res: any) {
    // 태그 확인
    const tag: Tag = await this.tagService.getOneTagByName(query.tag);
    if (!tag) throw new NotFoundException('tag/not-found');
    
    // 큐 질문 리스트 조회
    const data = await this.questionService.getNormalQuestionList(query.excludeClosed, query.excludeAnswered, tag, req.user);
    
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
  async getQuestion(@Param() param: DTO.getQuestionParam, @Res() res: any) {
    const question = await this.questionService.getQuestion(parseInt(param.questionId, 10));
    if (!question) throw new NotFoundException('question/not-found');

    return res.status(200).send({ message: 'success', data: question });
  }
}
