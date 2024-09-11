import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';

export class WalletCreditedEvent
  implements EventSourcingEvent<{ amount: number }>
{
  static readonly eventType = 'WalletCredited';
  readonly eventType = WalletCreditedEvent.eventType;

  constructor(public readonly payload: { amount: number }) {}
}
