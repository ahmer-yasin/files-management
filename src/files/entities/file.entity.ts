/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  url: string;

  @Column({
    default: 0,
    type: 'int',
  })
  verson: number;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  file_name: string;

  @Column('bytea', { nullable: false })
  file_content: Buffer;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
