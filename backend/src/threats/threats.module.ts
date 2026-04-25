import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreatsService } from './threats.service';
import { ThreatsController } from './threats.controller';
import { ThreatApp } from './entities/threat-app.entity';
import { ThreatUrl } from './entities/threat-url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThreatApp, ThreatUrl])],
  controllers: [ThreatsController],
  providers: [ThreatsService],
  exports: [ThreatsService],
})
export class ThreatsModule {}
