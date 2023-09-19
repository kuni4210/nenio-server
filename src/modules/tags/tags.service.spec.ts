import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Tag } from '../../shared/entities/Tag.entity';
import { TagsService } from './tags.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TagsService', () => {
  let service: TagsService;
  let tagRepository: MockRepository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: 'TagRepository',
          useFactory: () => ({
            save: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagRepository = module.get('TagRepository') as MockRepository<Tag>;
  });

  describe('createTag: 태그 등록', () => {
    let body = {
      content: '여행',
    };
    it('Tag 생성', async () => {
      tagRepository.save = jest.fn().mockResolvedValue(undefined);

      await service.createTag(body);

      expect(tagRepository.save).toHaveBeenCalledTimes(1);
      expect(tagRepository.save).toHaveBeenCalledWith({
        content: body.content,
      });
    });
  });
});
