import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

export class WalletDepositedEvent
  implements EventSourcingEvent<{ amount: number; transaction: Transaction }>
{
  static readonly eventType = 'WalletDeposited';
  readonly eventType = WalletDepositedEvent.eventType;

  constructor(
    public readonly payload: { amount: number; transaction: Transaction },
  ) {}
}
