import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'text' }) // 'text', 'image', 'video'
  type: string;

  @Column('text')
  content: string; // text content or URL to media

  @Column({ default: 5 })
  durationSeconds: number;

  @Column({ nullable: true })
  buttonText: string;

  @Column({ nullable: true })
  targetUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
