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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  @Expose({ name: 'deleted_at' })
  deletedAt?: Date;

  // constructor(bases?: Partial<BaseEntity>) {
  //   this.id = bases.id;
  //   this.createdAt = bases.createdAt;
  //   this.updatedAt = bases.updatedAt;
  //   this.deletedAt = bases.deletedAt;
  // }
}
