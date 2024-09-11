import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';

export class WalletCreatedEvent implements EventSourcingEvent<{ id: string }> {
  static readonly eventType = 'WalletCreated';
  readonly eventType = WalletCreatedEvent.eventType;

  constructor(public readonly payload: { id: string }) {}
}
