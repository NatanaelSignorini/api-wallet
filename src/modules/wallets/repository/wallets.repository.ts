import { Injectable } from '@nestjs/common';
import { EventSourcingEventEntity } from 'src/modules/event-sourcing/entities/event-sourcing-event.entity';
import { EventSourcingRepository } from 'src/modules/event-sourcing/repository/event-sourcing.repository';
import { EntityManager } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletsRepository {
  constructor(
    private readonly eventSourcingRepository: EventSourcingRepository,
  ) {}

  async saveWallet(wallet: Wallet, manager?: EntityManager): Promise<Wallet> {
    const uncommittedEvents = wallet.getUncommittedEvents();
    const eventsToSave = uncommittedEvents.map((event) => {
      const eventEntity = new EventSourcingEventEntity();
      eventEntity.entityId = wallet.id;
      eventEntity.entityName = 'Wallet';
      eventEntity.eventType = event.eventType;
      eventEntity.payload = event.payload;
      return eventEntity;
    });
    await this.eventSourcingRepository.saveEvents(eventsToSave, manager);
    wallet.clearUncommittedEvents();
    return wallet;
  }

  async findByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<Wallet | undefined> {
    const events = await this.eventSourcingRepository.findEventsForEntity(
      'Wallet',
      userId,
      manager,
    );

    if (events.length === 0) {
      return undefined;
    }

    const wallet = new Wallet();
    wallet.loadFromHistory(events);

    return wallet;
  }
}
