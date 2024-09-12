import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

export class WalletCreditedEvent
  implements EventSourcingEvent<{ amount: number; transaction: Transaction }>
{
  static readonly eventType = 'WalletCredited';
  readonly eventType = WalletCreditedEvent.eventType;

  constructor(
    public readonly payload: { amount: number; transaction: Transaction },
  ) {}
}
