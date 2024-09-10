import { BaseEntity } from 'src/modules/bases/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('transfers')
export class Transfer extends BaseEntity {
  @Column({ name: 'payer_id' })
  payerId: string;

  @Column({ name: 'payee_id' })
  payeeId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  constructor(payerId: string, payeeId: string, amount: number) {
    super();
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.amount = amount;
    this.date = new Date();
  }
}
