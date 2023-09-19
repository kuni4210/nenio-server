import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsNotEmpty, Length } from 'class-validator';
import { Question } from './Question.entity';
import { User } from './User.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 30 })
  content!: string;

  @OneToMany(() => Question, (question) => question.tag)
  questions?: Question[];

  @ManyToMany(() => User)
  users?: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
