// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   OneToMany,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   ManyToMany,
//   JoinTable,
// } from 'typeorm';
// import { User } from './User.entity';

// @Entity({ name: 'notices' })
// export class Notice {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @Column()
//   content: string;

//   @ManyToMany(() => User)
//   @JoinTable()
//   users: User[];

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;

//   @DeleteDateColumn()
//   deleted_at: Date | null;
// }
