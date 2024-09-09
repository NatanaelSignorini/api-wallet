import { passwordEncoder } from 'src/common/decorators/encodePassword.decorator';
import { BaseEntity } from 'src/modules/bases/entities/base.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ name: 'full_name', type: 'varchar', length: 60, nullable: true })
  fullName?: string;

  @Column({
    name: 'cpf_cnpj',
    unique: true,
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  cpfCnpj?: string;

  @Column({ type: 'varchar', length: 45, unique: true, nullable: false })
  email: string;

  @Column({
    type: 'varchar',
    length: 72,
    nullable: false,
  })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles?: Role[];

  @BeforeInsert()
  emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await passwordEncoder.hash(this.password);
    }
  }

  @BeforeUpdate()
  async updatePassword(): Promise<void> {
    if (this.password) {
      this.password = await passwordEncoder.hash(this.password);
    }
  }
}
