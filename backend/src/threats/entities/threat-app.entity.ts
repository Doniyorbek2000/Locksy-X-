import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('threats_apps')
export class ThreatApp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  packageName: string;

  @Column({ nullable: true })
  hash: string;

  @Column('simple-array', { nullable: true })
  permissions: string[];

  @Column()
  riskLevel: string; // SAFE, LOW, MEDIUM, HIGH, CRITICAL

  @Column({ default: 'LOW' })
  severity: string;

  @Column({ default: 0 })
  riskScore: number;

  @Column({ default: 'PENDING' })
  status: string; // APPROVED, REJECTED, PENDING

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
