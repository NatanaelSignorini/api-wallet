import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';

export class WalletDebitedEvent
  implements EventSourcingEvent<{ amount: number }>
{
  static readonly eventType = 'WalletDebited';
  readonly eventType = WalletDebitedEvent.eventType;

  constructor(public readonly payload: { amount: number }) {}
}
