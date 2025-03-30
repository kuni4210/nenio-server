import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { Option } from './Option.entity';
import { Tag } from './Tag.entity';
import { User } from './User.entity';
// import { Answer } from './Answer.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ['admin', 'user'] })
  userType!: string;

  @Column({ type: 'enum', enum: ['normal', 'random'] })
  questionType!: string;

  @Column({ type: 'enum', enum: ['ox', 'image', 'text'] })
  optionType!: string;

  @Column({ length: 45 })
  content!: string;

  @Column({ nullable: true })
  image?: string;

  // @OneToMany(() => Answer, (answer) => answer.question)
  // answers?: Answer[];

  @ManyToOne(() => Tag, () => Tag)
  tag!: Tag;

  @ManyToMany(() => User, (user) => user.participatedQuestions)
  @JoinTable({ name: 'questions_users' })
  participants?: User[];

  @ManyToOne(() => User, (user) => user.authorizedQuestions)
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @OneToMany(() => Option, (option) => option.question)
  options?: Option[];

  @Column()
  endedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
