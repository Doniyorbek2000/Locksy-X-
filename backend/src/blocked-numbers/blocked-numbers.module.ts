import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedNumbersController } from './blocked-numbers.controller';
import { BlockedNumber } from './entities/blocked-number.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedNumber])],
  controllers: [BlockedNumbersController],
})
export class BlockedNumbersModule {}
