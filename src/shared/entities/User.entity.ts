import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { Tag } from './Tag.entity';
// import { Answer } from './Answer.entity';
import { Notification } from './Notification.entity';
import { Question } from './Question.entity';
import { Option } from './Option.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firebaseUid!: string;

  @Column({ type: 'enum', enum: ['admin', 'user'] })
  userType!: string;

  @Column({ nullable: true, length: 255 })
  email?: string;

  @Column({ length: 30 })
  nickname!: string;

  @Column({ nullable: true })
  image?: string;

  // @OneToMany(() => Answer, (answer) => answer.user)
  // answers?: Answer[];

  @ManyToMany(() => Question, (question) => question.participants)
  participatedQuestions?: Question[];

  @ManyToMany(() => Option, (option) => option.participants)
  participatedOptions?: Option[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @OneToMany(() => Question, (question) => question.author)
  authorizedQuestions?: Question[];

  @ManyToMany(() => Tag)
  @JoinTable({ name: 'users_tags' })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
