import { BadRequestException } from '@nestjs/common';
import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { EventSourcedEntity } from 'src/modules/event-sourcing/entities/event-sourcing-entity';
import { WalletCreatedEvent } from '../events/wallet-created.event';
import { WalletCreditedEvent } from '../events/wallet-credited.event';
import { WalletDebitedEvent } from '../events/wallet-debited.event';

export class Wallet extends EventSourcedEntity<EventSourcingEvent<any>> {
  id: string;
  balance: number;

  static create(id: string): Wallet {
    const wallet = new Wallet();
    wallet.addEvent(new WalletCreatedEvent({ id }));
    return wallet;
  }

  credit(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be positive');
    }
    this.addEvent(new WalletCreditedEvent({ amount }));
  }

  debit(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Debit amount must be positive');
    }
    if (this.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    this.addEvent(new WalletDebitedEvent({ amount }));
  }

  protected applyEvent(event: EventSourcingEvent<any>): void {
    switch (event.eventType) {
      case WalletCreatedEvent.eventType:
        this.id = (event as WalletCreatedEvent).payload.id;
        this.balance = 0;
        break;
      case WalletCreditedEvent.eventType:
        this.balance += (event as WalletCreditedEvent).payload.amount;
        break;
      case WalletDebitedEvent.eventType:
        this.balance -= (event as WalletDebitedEvent).payload.amount;
        break;
      default:
        throw new Error(`Unknown event type: ${event.eventType}`);
    }
  }
}
