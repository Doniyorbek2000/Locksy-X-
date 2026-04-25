import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('threats_urls')
export class ThreatUrl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  domain: string;

  @Column()
  type: string; // PHISHING, SCAM, SAFE

  @Column()
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL

  @Column({ default: 0 })
  riskScore: number;

  @Column({ default: 0 })
  reports: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
