import { BaseEntity } from 'src/modules/bases/entities/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('event_sourcing_events')
export class EventSourcingEventEntity extends BaseEntity {
  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({ name: 'entity_name' })
  entityName: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column('json')
  payload: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
