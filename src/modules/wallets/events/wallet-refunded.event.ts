import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

export class WalletRefundedEvent
  implements
    EventSourcingEvent<{
      amount: number;
      transaction: Transaction;
      payer: boolean;
    }>
{
  static readonly eventType = 'WalletRefunded';
  readonly eventType = WalletRefundedEvent.eventType;

  constructor(
    public readonly payload: {
      amount: number;
      transaction: Transaction;
      payer: boolean;
    },
  ) {}
}
