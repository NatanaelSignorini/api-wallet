import { BaseEntity } from 'src/modules/bases/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ name: 'payer_id' })
  payerId: string;

  @Column({ name: 'payee_id', nullable: true })
  payeeId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ name: 'valide_reverse', type: 'boolean', default: false })
  valideReverse: boolean;

  constructor(transaction?: Partial<Transaction>) {
    super();
    if (transaction) {
      this.payerId = transaction.payerId;
      this.payeeId = transaction.payeeId;
      this.amount = transaction.amount;
      this.valideReverse = transaction.valideReverse;
      this.date = transaction.date;
    }
  }
}
