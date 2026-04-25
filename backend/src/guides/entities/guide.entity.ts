import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('guides')
export class Guide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'uz' })
  lang: string; // uz, ru, en

  @Column('text')
  content: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
