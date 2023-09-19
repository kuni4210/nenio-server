import { DataSource } from 'typeorm';
import { Notification } from './src/shared/entities/Notification.entity';
import { Option } from './src/shared/entities/Option.entity';
import { Question } from './src/shared/entities/Question.entity';
import { Tag } from './src/shared/entities/Tag.entity';
import { User } from './src/shared/entities/User.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  username: 'root',
  password: 'enfvh2520',
  database: 'nenio',
  entities: [Notification, Option, Question, Tag, User],
  migrations: [__dirname + '/src/shared/seeds/*.ts'],
  synchronize: true,
  logging: true,
});

export default dataSource;
