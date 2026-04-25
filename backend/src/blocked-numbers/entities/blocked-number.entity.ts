import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('blocked_numbers')
export class BlockedNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({ default: 'admin' }) // 'admin' means global, otherwise locksyId
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
