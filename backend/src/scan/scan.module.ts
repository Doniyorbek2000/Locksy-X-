import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';
import { ThreatsModule } from '../threats/threats.module';

@Module({
  imports: [ThreatsModule],
  controllers: [ScanController],
  providers: [ScanService],
})
export class ScanModule {}
