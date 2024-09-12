import { BadRequestException } from '@nestjs/common';
import { EventSourcingEvent } from 'src/modules/event-sourcing/declare/event-sourcing-event';
import { EventSourcedEntity } from 'src/modules/event-sourcing/entities/event-sourcing-entity';
import { Transfer } from 'src/modules/transfers/entities/transfer.entity';
import { WalletCreatedEvent } from '../events/wallet-created.event';
import { WalletCreditedEvent } from '../events/wallet-credited.event';
import { WalletDebitedEvent } from '../events/wallet-debited.event';
import { WalletDepositedEvent } from '../events/wallet-deposited.event';
import { WalletRefundedEvent } from '../events/wallet-refunded.event';

export class Wallet extends EventSourcedEntity<EventSourcingEvent<any>> {
  id: string;
  balance: number;
  transactions: Transfer;

  static create(id: string): Wallet {
    const wallet = new Wallet();
    wallet.addEvent(new WalletCreatedEvent({ id }));
    return wallet;
  }

  credit(amount: number, transfer: Transfer): void {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be positive');
    }
    this.addEvent(new WalletCreditedEvent({ amount, transfer }));
  }

  debit(amount: number, transfer: Transfer): void {
    if (amount <= 0) {
      throw new BadRequestException('Debit amount must be positive');
    }
    if (this.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    this.addEvent(new WalletDebitedEvent({ amount, transfer }));
  }

  deposit(amount: number, transfer: Transfer): void {
    this.addEvent(new WalletDepositedEvent({ amount, transfer }));
  }

  refund(transfer: Transfer, amount: number, payer: boolean): void {
    this.addEvent(new WalletRefundedEvent({ amount, transfer, payer }));
  }

  protected applyEvent(event: EventSourcingEvent<any>): void {
    switch (event.eventType) {
      case WalletCreatedEvent.eventType:
        this.id = (event as WalletCreatedEvent).payload.id;
        this.balance = 0;
        break;

      case WalletCreditedEvent.eventType:
        this.transactions = (event as WalletDepositedEvent).payload.transfer;
        this.balance += (event as WalletCreditedEvent).payload.amount;
        break;

      case WalletDebitedEvent.eventType:
        this.transactions = (event as WalletDepositedEvent).payload.transfer;
        this.balance -= (event as WalletDebitedEvent).payload.amount;
        break;

      case WalletDepositedEvent.eventType:
        this.transactions = (event as WalletDepositedEvent).payload.transfer;
        this.balance += (event as WalletDepositedEvent).payload.amount;
        break;

      case WalletRefundedEvent.eventType:
        const payer = (event as WalletRefundedEvent).payload.payer;
        const balance = (event as WalletRefundedEvent).payload.amount;
        if (payer) {
          this.transactions = (event as WalletRefundedEvent).payload.transfer;
          this.balance += balance;
        }
        if (!payer) {
          this.transactions = (event as WalletRefundedEvent).payload.transfer;
          this.balance -= balance;
        }

        break;
      default:
        throw new Error(`Unknown event type: ${event.eventType}`);
    }
  }
}
