import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from '../../shared/entities/Option.entity';
import { Question } from '../../shared/entities/Question.entity';
import { Tag } from '../../shared/entities/Tag.entity';
import { User } from '../../shared/entities/User.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TagsService } from '../tags/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option, User, Tag, Question])],
  providers: [QuestionsService, TagsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
