// import { IsNotEmpty, IsString, Length } from 'class-validator';
// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Option } from './Option.entity';
// import { Question } from './Question.entity';
// import { User } from './User.entity';

// @Entity({ name: 'answers' })
// export class Answer {
//   @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
//   id!: number;

//   @ManyToOne(() => User, (user) => user.answers)
//   @JoinColumn({ name: 'userId' })
//   user!: User;

//   @ManyToOne(() => Question, (question) => question.answers)
//   @JoinColumn({ name: 'questionId' })
//   question!: Question;

//   @ManyToOne(() => Option, (option) => option.answers)
//   @JoinColumn({ name: 'optionId' })
//   option!: Option;

//   @CreateDateColumn()
//   createdAt!: Date;

//   @UpdateDateColumn()
//   updatedAt!: Date;

//   @DeleteDateColumn()
//   deletedAt?: Date;
// }
