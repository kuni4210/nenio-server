import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../../shared/entities/Tag.entity';
import { User } from '../../shared/entities/User.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
