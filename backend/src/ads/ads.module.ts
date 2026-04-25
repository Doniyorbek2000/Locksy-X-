import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsController } from './ads.controller';
import { Ad } from './entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad])],
  controllers: [AdsController],
})
export class AdsModule {}
