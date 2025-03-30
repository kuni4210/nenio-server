import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
// import { Answer } from './shared/entities/Answer.entity';
import { Notification } from './shared/entities/Notification.entity';
import { Option } from './shared/entities/Option.entity';
import { Question } from './shared/entities/Question.entity';
import { Tag } from './shared/entities/Tag.entity';
import { User } from './shared/entities/User.entity';
import { TagsModule } from './modules/tags/tags.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { FilesModule } from './modules/files/files.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Notification, Option, Question, Tag, User],
      synchronize: true,
      // migrations: [__dirname + '/migrations/*.ts'],
      // autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    FilesModule,
    QuestionsModule,
    UsersModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
