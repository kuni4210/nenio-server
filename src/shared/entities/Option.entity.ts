import { IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// import { Answer } from './Answer.entity';
import { Question } from './Question.entity';
import { User } from './User.entity';

@Entity({ name: 'options' })
export class Option {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({ nullable: true })
  image?: string;

  // @OneToMany(() => Answer, (answer) => answer.option)
  // answers?: Answer[];

  @ManyToMany(() => User, (user) => user.participatedOptions)
  @JoinTable({ name: 'options_users' })
  participants?: User[];

  @ManyToOne(() => Question, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
