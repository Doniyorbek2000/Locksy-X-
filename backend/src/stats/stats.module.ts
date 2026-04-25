import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { User } from '../users/entities/user.entity';
import { BlockedNumber } from '../blocked-numbers/entities/blocked-number.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BlockedNumber, Notification])],
  controllers: [StatsController],
})
export class StatsModule {}
