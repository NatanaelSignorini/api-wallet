import { BaseEntity } from 'src/modules/bases/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../enum/role.enum';

@Entity('Roles')
export class Role extends BaseEntity {
  @Column({
    unique: true,
    type: 'enum',
    enum: RolesEnum,
    nullable: false,
  })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  constructor(role?: Partial<Role>) {
    super();
    if (role) {
      this.id = role.id;
      this.createdAt = role.createdAt;
      this.updatedAt = role.updatedAt;
      this.deletedAt = role.deletedAt;
      this.name = role?.name;
      this.users = role?.users || [];
    }
  }
}
