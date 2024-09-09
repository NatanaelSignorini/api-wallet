import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Expose({ name: 'deleted_at' })
  deletedAt?: Date;
}
