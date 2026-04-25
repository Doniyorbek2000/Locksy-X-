import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidesController } from './guides.controller';
import { Guide } from './entities/guide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guide])],
  controllers: [GuidesController],
})
export class GuidesModule {}
