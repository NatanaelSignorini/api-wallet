import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transfer } from 'src/modules/transfers/entities/transfer.entity';

export class WalletRefundedEvent
  implements
    EventSourcingEvent<{ amount: number; transfer: Transfer; payer: boolean }>
{
  static readonly eventType = 'WalletRefunded';
  readonly eventType = WalletRefundedEvent.eventType;

  constructor(
    public readonly payload: {
      amount: number;
      transfer: Transfer;
      payer: boolean;
    },
  ) {}
}
