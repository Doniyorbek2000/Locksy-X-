import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreatsModule } from './threats/threats.module';
import { ScanModule } from './scan/scan.module';
import { UsersModule } from './users/users.module';
import { GuidesModule } from './guides/guides.module';
import { AdsModule } from './ads/ads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BlockedNumbersModule } from './blocked-numbers/blocked-numbers.module';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // DEV ONLY
    }),
    ThreatsModule,
    ScanModule,
    UsersModule,
    GuidesModule,
    AdsModule,
    NotificationsModule,
    BlockedNumbersModule,
    StatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
