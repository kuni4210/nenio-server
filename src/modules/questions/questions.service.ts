import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Option } from '../../shared/entities/Option.entity';
import { Question } from '../../shared/entities/Question.entity';
import { Tag } from '../../shared/entities/Tag.entity';
import { User } from '../../shared/entities/User.entity';
import * as DTO from './questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneQuestionByIdAndUserId(questionId: number, userId: number): Promise<Question> {
    const question: Question = await this.questionRepository
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.participants', 'participants')
    .where('question.deletedAt IS NULL')
    .andWhere('question.id = :questionId', { questionId: questionId })
    .andWhere('question.author = :userId', { userId: userId })
    .getOne();

    return question
  }

  async createQuestion(
    questionType: string,
    optionType: string,
    questionContent: string,
    questionImage: string,
    endedAt: Date,
    optionContent1: string,
    optionImage1: string | null,
    optionContent2: string,
    optionImage2: string | null,
    tag: Tag,
    user: User
  ): Promise<void> {
    const question = new Question();
    question.tag = tag;
    question.userType = user.userType;
    question.questionType = questionType;
    question.optionType = optionType;
    question.content = questionContent;
    question.image = questionImage;
    question.endedAt = endedAt ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const option1 = new Option();
    option1.content = optionType !== 'ox' ? optionContent1 : 'o';
    option1.image = optionImage1;
    option1.question = question;

    const option2 = new Option();
    option2.content = optionType !== 'ox' ? optionContent2 : 'x';
    option2.image = optionImage2;
    option2.question = question;

    question.options = [option1, option2];
    question.author = user;

    await this.questionRepository.save(question);
    await this.optionRepository.save(option1);
    await this.optionRepository.save(option2);
  }

  async updateQuestion(
    questionType: string,
    optionType: string,
    questionContent: string,
    questionImage: string,
    endedAt: Date,
    optionContent1: string,
    optionImage1: string | null,
    optionContent2: string,
    optionImage2: string | null,
    tag: Tag,
    question: Question,
    user: User
  ) {
    question.tag = tag;
    question.questionType = questionType;
    question.optionType = optionType;
    question.content = questionContent;
    question.image = questionImage;
    question.endedAt = endedAt ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const option1 = new Option();
    option1.content = optionType !== 'ox' ? optionContent1 : 'o';
    option1.image = optionImage1;
    option1.question = question;

    const option2 = new Option();
    option2.content = optionType !== 'ox' ? optionContent2 : 'x';
    option2.image = optionImage2;
    option2.question = question;

    question.options = [option1, option2];
    question.author = user;

    await this.questionRepository.save(question);
    await this.optionRepository.save(option1);
    await this.optionRepository.save(option2);
  }

  async deleteQuestion(questionId: number, transactionManager: EntityManager): Promise<void> {
    await transactionManager
    .createQueryBuilder()
    .update(Question)
    .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
    .where('id = :questionId', { questionId })
    .execute();

  await transactionManager
    .createQueryBuilder()
    .update(Option)
    .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
    .where('questionId = :questionId', { questionId })
    .execute();
  }

  async participateQuestion(
    option: Option,
    question: Question,    
    user: User,
  ): Promise<void> {
    user.participatedQuestions = [question];
    user.participatedOptions = [option];
    await this.userRepository.save(user);
  }

  async getRegisteredQuestionList(excludeClosed: string, user: User) {
    const cond = this.questionRepository
      .createQueryBuilder('question')
      .where('question.deletedAt IS NULL')
      .andWhere('question.author.id = :authorId', { authorId: user.id });
    if (excludeClosed === 'true') {
      cond.andWhere('question.endedAt > NOW()');
    }
    cond.select([
      'question.id',
      'question.content',
      'question.createdAt',
      'question.endedAt',
      'question.questionType',
      'tag.content',
    ]);
    return await cond.getMany();
  }

  async getParticipatedQuestionList(
    excludeClosed: string,
    user: User,
  ) {
    const cond = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tag', 'tag')
      .leftJoinAndSelect('question.participants', 'participants1')
      .leftJoin('question.participants', 'participants2', 'participants2.id = :userId', { userId: user.id })
      .where('question.deletedAt IS NULL')
      .andWhere('participants2.id IS NOT NULL');
    if (excludeClosed === 'true') {
      cond.andWhere('question.endedAt > NOW()');
    }
    cond.select([
      'question.id',
      'question.content',
      'question.createdAt',
      'question.endedAt',
      'question.questionType',
      'tag.content',
      'participants1.id',
      'participants1.image',
    ]);
    return await cond.getMany();
  }

  async getNormalQuestionList(
    excludeClosed: string,
    excludeAnswered: string,
    tag: Tag,
    user: User, // : Promise<ResponseDTO.getNormalQuestionList[]>
  ) {
    const cond = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.participants', 'participants1');
    if (excludeAnswered === 'true') {
      cond.leftJoin('question.participants', 'participants2', 'participants2.id = :userId', { userId: user.id });
    }
    cond
      .where('question.deletedAt IS NULL')
      .andWhere('question.tag = :tagId', { tagId: tag.id })
      .andWhere('questionType = :questionType', { questionType: 'normal' });
    if (excludeClosed === 'true') {
      cond.andWhere('question.endedAt > NOW()');
    }
    if (excludeAnswered === 'true') {
      cond.andWhere('participants2.id IS NULL');
    }
    cond.select([
      'question.id',
      'question.content',
      'question.createdAt',
      'question.endedAt',
      'participants1.id',
      'participants1.image',
    ]);

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

  async getQuestion(questionId: number): Promise<any> {
    const question: Question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .leftJoinAndSelect('question.tag', 'tag')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('options.participants', 'participants')
      .select([
        'question.id',
        'author.nickname',
        'author.image',
        'question.questionType',
        'question.optionType',
        'question.content',
        'question.image',
        'question.endedAt',
        'question.createdAt',
        'options.id',
        'options.content',
        'options.image',
        'participants.id',
        'participants.image',
      ])
      .where('question.deletedAt IS NULL')
      .andWhere('question.id = :questionId', { questionId: questionId })
      .getOne();
    return question;
  }

  async getOneOptionById(optionId: number): Promise<Option> {
    const option: Option = await this.optionRepository
    .createQueryBuilder('option')
    .where('option.id = :optionId', { optionId: optionId })
    .getOne();

    return option
  }

}
