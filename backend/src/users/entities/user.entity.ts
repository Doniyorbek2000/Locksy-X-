import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  locksyId: string;

  @Column({ nullable: true })
  region: string;

  @Column({ default: 'SAFE' })
  riskLevel: string;

  @CreateDateColumn()
  registeredAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastLoginAt: Date;
}
