import { IsEmail } from 'class-validator';
import { Message } from 'src/messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 100 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  // a person sends many messages
  // this messages are a relationship to the "from" field in the Message entity
  @OneToMany(() => Message, (message) => message.from)
  sentMessages: Message[];

  // a person receives many messages
  // this messages are a relationship to the "to" field in the Message entity
  @OneToMany(() => Message, (message) => message.to)
  receivedMessages: Message[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: true })
  active: boolean;
}
