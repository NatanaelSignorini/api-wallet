import { BaseEntity } from 'src/modules/bases/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { RolesEnum } from '../enum/role.enum';

@Entity()
export class Role extends BaseEntity {
  @Column({
    unique: true,
    type: 'enum',
    enum: RolesEnum,
    nullable: false,
  })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
