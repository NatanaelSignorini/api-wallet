import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { Transfer } from 'src/modules/transfers/entities/transfer.entity';

export class WalletDepositedEvent
  implements EventSourcingEvent<{ amount: number; transfer: Transfer }>
{
  static readonly eventType = 'WalletDeposited';
  readonly eventType = WalletDepositedEvent.eventType;

  constructor(
    public readonly payload: { amount: number; transfer: Transfer },
  ) {}
}
