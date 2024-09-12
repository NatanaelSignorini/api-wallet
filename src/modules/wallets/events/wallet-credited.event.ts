import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transfer } from 'src/modules/transfers/entities/transfer.entity';

export class WalletCreditedEvent
  implements EventSourcingEvent<{ amount: number; transfer: Transfer }>
{
  static readonly eventType = 'WalletCredited';
  readonly eventType = WalletCreditedEvent.eventType;

  constructor(
    public readonly payload: { amount: number; transfer: Transfer },
  ) {}
}
