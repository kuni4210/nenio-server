import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import * as RequestDTO from './dto/tags-request.dto';
import { Tag } from '../../shared/entities/Tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>, // private dataSource: DataSource,
  ) {}

  async createTag(body: RequestDTO.createTag): Promise<void> {
    const tag = new Tag();
    tag.content = body.content;
    await this.tagRepository.save(tag);
  }

  async getAllTagList(): Promise<Tag[]> {
    const tags: Tag[] = await this.tagRepository.createQueryBuilder('tag').select(['tag.id', 'tag.content']).getMany();
    return tags;
  }

  async getBestTagList(): Promise<Tag[]> {
    const tags: Tag[] = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.questions', 'question')
      .select(['tag.id as id', 'tag.content as content', 'COUNT(question.id) as count'])
      .groupBy('tag.id')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();
    return tags;
  }
}
