import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from '../../shared/entities/Option.entity';
import { Question } from '../../shared/entities/Question.entity';
import { QuestionsService } from './questions.service';
import * as RequestDTO from './dto/questions-request.dto';
import { User } from '../../shared/entities/User.entity';
import { Tag } from '../../shared/entities/Tag.entity';
import { NotFoundException } from '@nestjs/common';

class MockRepository {
  createQueryBuilder = jest.fn(() => this);
  where = jest.fn(() => this);
  getOne = jest.fn(() => null);
  save = jest.fn(() => Promise.resolve());
}

describe('QuestionsService', () => {
  let questionService: QuestionsService;

  let questionRepository: Repository<Question>;
  let optionRepository: Repository<Option>;
  let tagRepository: Repository<Tag>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Option),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    questionService = module.get<QuestionsService>(QuestionsService);

    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    optionRepository = module.get<Repository<Option>>(getRepositoryToken(Option));
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createQuestion: 질문 등록', () => {
    beforeEach(async () => {});
    it('태그가 있는 경우 질문 등록', async () => {
      // Arrange
      const mockBody: RequestDTO.createQuestionBody = {
        tag: 'SampleTag',
        questionType: 'SampleType',
        optionType: 'SampleOptionType',
        questionTitle: 'SampleTitle',
        questionContent: 'SampleContent',
        questionImage: 'SampleImage',
        endedAt: new Date(),
        optionContent1: 'SampleOption1',
        optionImage1: 'SampleOptionImage1',
        optionContent2: 'SampleOption2',
        optionImage2: 'SampleOptionImage2',
      };

      const mockTag = new Tag();
      mockTag.content = 'MockTag';

      const mockUser = new User();
      mockUser.userType = 'MockUserType';

      tagRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTag),
      });

      questionRepository.save = jest.fn().mockResolvedValue(null);
      optionRepository.save = jest.fn().mockResolvedValue(null);

      // Act
      await questionService.createQuestion(mockBody, mockUser);

      // Assert
      expect(tagRepository.createQueryBuilder().where).toHaveBeenCalledWith('tag.content = :tagContent', {
        tagContent: mockBody.tag,
      });
      expect(questionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tag: mockTag,
          userType: mockUser.userType,
        }),
      );
      expect(optionRepository.save).toHaveBeenCalledWith(expect.objectContaining({ content: mockBody.optionContent1 }));

      // expect(tagRepository.createQueryBuilder).toHaveBeenCalledWith('tag');
      // expect(tagRepository.where).toHaveBeenCalledWith('tag.content = :tagContent', { tagContent: mockBody.tag });
      // expect(tagRepository.getOne).toHaveBeenCalled();
      // expect(mockRepository.save).toHaveBeenCalledTimes(3);
    });

    it('태그가 없는 경우 NotFoundException', async () => {
      // Arrange
      const createQuestionBody: RequestDTO.createQuestionBody = {
        tag: 'SampleTag',
        questionType: 'SampleType',
        optionType: 'SampleOptionType',
        questionTitle: 'SampleTitle',
        questionContent: 'SampleContent',
        questionImage: 'SampleImage',
        endedAt: new Date(),
        optionContent1: 'SampleOption1',
        optionImage1: 'SampleOptionImage1',
        optionContent2: 'SampleOption2',
        optionImage2: 'SampleOptionImage2',
      };
      const mockUser = new User();
      mockUser.userType = 'MockUserType';

      tagRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert
      const createQuestionPromise = questionService.createQuestion(createQuestionBody, mockUser);

      await expect(createQuestionPromise).rejects.toThrow(NotFoundException);
    });
  });
});
