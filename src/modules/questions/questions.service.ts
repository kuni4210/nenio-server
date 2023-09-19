import { BadRequestException, HttpException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Option } from '../../shared/entities/Option.entity';
import { Question } from '../../shared/entities/Question.entity';
import { Tag } from '../../shared/entities/Tag.entity';
import { User } from '../../shared/entities/User.entity';
import * as RequestDTO from './dto/questions-request.dto';
import * as ResponseDTO from './dto/questions-response.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createQuestion(body: RequestDTO.createQuestionBody, user: User): Promise<void> {
    const tag: Tag = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.content = :tagContent', { tagContent: body.tag })
      .getOne();
    if (!tag) throw new NotFoundException('tag/not-found');
    const question = new Question();
    question.tag = tag;
    question.userType = user.userType;
    question.questionType = body.questionType;
    question.optionType = body.optionType;
    question.title = body.questionTitle;
    question.content = body.questionContent;
    question.image = body.questionImage;
    question.endedAt = body.endedAt;

    const option1 = new Option();
    option1.content = body.optionType !== 'ox' ? body.optionContent1 : 'o';
    option1.image = body.optionImage1;
    option1.question = question;

    const option2 = new Option();
    option2.content = body.optionType !== 'ox' ? body.optionContent2 : 'x';
    option2.image = body.optionImage2;
    option2.question = question;

    question.options = [option1, option2];
    question.author = user;

    await this.questionRepository.save(question);
    await this.optionRepository.save(option1);
    await this.optionRepository.save(option2);
  }

  async updateQuestion(param: RequestDTO.updateQuestionParam, body: RequestDTO.updateQuestionBody, user: User): Promise<void> {
    const question: Question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.participants', 'participants')
      .where('question.deletedAt IS NULL')
      .andWhere('question.id = :questionId', { questionId: param.questionId })
      .andWhere('question.author = :userId', { userId: user.id })
      .getOne();
    if (!question) throw new NotFoundException('question/not-found');
    if (question.participants.length > 0) throw new BadRequestException('qustion/answers-related-to-question-registered');
    const tag: Tag = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.content = :tagContent', { tagContent: body.tag })
      .getOne();
    if (!tag) throw new NotFoundException('tag/not-found');

    question.tag = tag;
    question.questionType = body.questionType;
    question.optionType = body.optionType;
    question.title = body.questionTitle;
    question.content = body.questionContent;
    question.image = body.questionImage;
    question.endedAt = body.endedAt;

    const option1 = new Option();
    option1.content = body.optionType !== 'ox' ? body.optionContent1 : 'o';
    option1.image = body.optionImage1;
    option1.question = question;

    const option2 = new Option();
    option2.content = body.optionType !== 'ox' ? body.optionContent2 : 'x';
    option2.image = body.optionImage2;
    option2.question = question;

    question.options = [option1, option2];
    question.author = user;

    await this.questionRepository.save(question);
    await this.optionRepository.save(option1);
    await this.optionRepository.save(option2);
  }

  async deleteQuestion(param: RequestDTO.deleteQuestionParam, user: User): Promise<void> {
    const question: Question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.participants', 'participants')
      .where('question.deletedAt IS NULL')
      .andWhere('question.id = :questionId', { questionId: param.questionId })
      .andWhere('question.author = :userId', { userId: user.id })
      .getOne();
    if (!question) throw new NotFoundException('question/not-found');
    if (question.participants.length > 0) throw new BadRequestException('qustion/answers-related-to-question-registered');
    await this.questionRepository
      .createQueryBuilder()
      .update(Question)
      .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :questionId', { questionId: param.questionId })
      .execute();
    await this.optionRepository
      .createQueryBuilder()
      .update(Option)
      .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
      .where('questionId = :questionId', { questionId: param.questionId })
      .execute();
  }

  async participateQuestion(
    param: RequestDTO.participateQuestionParam,
    body: RequestDTO.participateQuestionBody,
    user: User,
  ): Promise<void> {
    // 날짜 안 지난 쿼리 추가
    const question: Question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.participants', 'participants', 'participants.id = :userId', { userId: user.id })
      .where('question.id = :questionId', { questionId: param.questionId })
      .getOne();
    if (!question) throw new NotFoundException('question/not-found');
    if (question.participants.length > 0) throw new BadRequestException('user/already-participated');
    const option: Option = await this.optionRepository
      .createQueryBuilder('option')
      .where('option.id = :optionId', { optionId: body.optionId })
      .getOne();
    if (!option) throw new NotFoundException('option/not-found');

    user.participatedQuestions = [question];
    user.participatedOptions = [option];
    await this.userRepository.save(user);
  }

  async getRegisteredQuestionList(query: RequestDTO.getMyQuestionListQuery, user: User) {
    // ): Promise<ResponseDTO.getMyQuestionList[]> {
    const cond = this.questionRepository
      .createQueryBuilder('question')
      .where('question.deletedAt IS NULL')
      .andWhere('question.author.id = :authorId', { authorId: user.id });
    if (query.excludeClosed === 'true') {
      // questions.andWhere('question.endedAt > :today', { today: new Date() });
      cond.andWhere('question.endedAt > NOW()');
    }
    cond.select([
      'question.id',
      'question.title',
      'question.content',
      'question.createdAt',
      'question.endedAt',
      'question.questionType',
      'tag.content',
    ]);
    // .orderBy('question.createdAt', 'DESC');
    return await cond.getMany();
  }

  async getParticipatedQuestionList(
    query: RequestDTO.getMyQuestionListQuery,
    user: User,
    // ): Promise<ResponseDTO.getMyQuestionList[]> {
  ) {
    const cond = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tag', 'tag')
      // .leftJoinAndSelect('question.participants', 'participants', 'participants.id = :userId', { userId: user.id })
      .leftJoinAndSelect('question.participants', 'participants1')
      .leftJoin('question.participants', 'participants2', 'participants2.id = :userId', { userId: user.id })
      .where('question.deletedAt IS NULL')
      .andWhere('participants2.id IS NOT NULL');
    if (query.excludeClosed === 'true') {
      // questions.andWhere('question.endedAt > :today', { today: new Date() });
      cond.andWhere('question.endedAt > NOW()');
    }
    cond.select([
      'question.id',
      'question.title',
      'question.content',
      'question.createdAt',
      'question.endedAt',
      'question.questionType',
      'tag.content',
      'participants1.id',
      'participants1.image',
      // `DATE_FORMAT(question.endedAt, '%Y-%m-%d') as endedAt`,
      // `DATE_FORMAT(question.createdAt, '%Y-%m-%d') as createdAt`,
    ]);
    // .orderBy('createdAt', 'DESC');
    return await cond.getMany();
  }

  async getNormalQuestionList(
    query: RequestDTO.getNormalQuestionListQuery,
    user: User, // : Promise<ResponseDTO.getNormalQuestionList[]>
  ) {
    const tag: Tag = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.content = :tagContent', { tagContent: query.tag })
      .getOne();
    if (!tag) throw new NotFoundException('tag/not-found');
    const cond = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.participants', 'participants1');
    if (query.excludeAnswered === 'true') {
      // cond.leftJoin('answers', 'a', 'a.questionId = question.id AND a.userId = :userId', { userId: user.id });
      cond.leftJoin('question.participants', 'participants2', 'participants2.id = :userId', { userId: user.id });
    }
    cond
      .where('question.deletedAt IS NULL')
      .andWhere('question.tag = :tagId', { tagId: tag.id })
      .andWhere('questionType = :questionType', { questionType: 'normal' });
    if (query.excludeClosed === 'true') {
      // questions.andWhere('question.endedAt > :today', { today: new Date() });
      cond.andWhere('question.endedAt > NOW()');
    }
    if (query.excludeAnswered === 'true') {
      cond.andWhere('participants2.id IS NULL');
    }
    cond.select([
      'question.id',
      'question.title',
      'question.content',
      'question.createdAt',
      'question.endedAt',
      'participants1.id',
      'participants1.image',
    ]);

    // const generatedQuery = cond.getSql();
    // console.log(generatedQuery);
    return await cond.getMany();
  }

  async getRandomQuestionList(user: User) {
    // Promise<ResponseDTO.getMyQuestionList[]> {
    const questions: Question[] = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.participants', 'participants', 'participants.id = :userId', { userId: user.id })
      .where('question.deletedAt IS NULL')
      .andWhere('question.endedAt > NOW()')
      .andWhere('question.questionType = :questionType', { questionType: 'random' })
      .andWhere('participants.id IS NULL')
      .select(['question.id'])
      .orderBy('RAND()')
      .take(10)
      .getMany();
    return questions;
  }

  async getQuestion(param: RequestDTO.getQuestionParam): Promise<any> {
    const question: Question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      // .leftJoinAndSelect('question.participants', 'participants')
      .leftJoinAndSelect('question.tag', 'tag')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('options.participants', 'participants')
      .select([
        'question.id',
        'author.nickname',
        'author.image',
        'question.questionType',
        'question.optionType',
        'question.title',
        'question.content',
        'question.image',
        'question.endedAt',
        'question.createdAt',
        'options.id',
        'options.content',
        'options.image',
        'participants.id',
        'participants.image',
        // 'answers.id',
        // 'user.id',
        // 'user.image',
      ])
      .where('question.deletedAt IS NULL')
      .andWhere('question.id = :questionId', { questionId: param.questionId })
      .getOne();
    // const generatedQuery = query.getSql();
    // console.log(generatedQuery);
    if (!question) throw new NotFoundException('question/not-found');
    return question;
  }

  async test() {
    const tags: Tag[] = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.questions', 'question')
      .select(['tag.id as id', 'tag.content as content', 'COUNT(question.id) as count'])
      .groupBy('tag.id')
      .orderBy('count', 'DESC')
      .limit(3)
      .getRawMany();
    return tags;
  }
}
