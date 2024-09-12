import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transfer } from 'src/modules/transfers/entities/transfer.entity';

export class WalletDebitedEvent
  implements EventSourcingEvent<{ amount: number; transfer: Transfer }>
{
  static readonly eventType = 'WalletDebited';
  readonly eventType = WalletDebitedEvent.eventType;

  constructor(
    public readonly payload: { amount: number; transfer: Transfer },
  ) {}
}
