import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlockedNumber } from '../blocked-numbers/entities/blocked-number.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Controller('stats')
export class StatsController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(BlockedNumber)
    private blockedNumRepo: Repository<BlockedNumber>,
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {}

  @Get()
  async getStats() {
    const [totalUsers, blockedNumbers, totalNotifications] = await Promise.all([
      this.userRepo.count(),
      this.blockedNumRepo.count(),
      this.notifRepo.count(),
    ]);

    // Get threat data from raw query via TypeORM
    const threatResult = await this.userRepo.query(`
      SELECT
        (SELECT COUNT(*) FROM threats_apps WHERE "riskLevel" IN ('HIGH RISK','DANGEROUS')) as "riskApps",
        (SELECT COUNT(*) FROM threats_urls WHERE type = 'DANGEROUS') as "blockedLinks",
        (SELECT COUNT(*) FROM threats_urls WHERE type = 'BLOCKED') as "adminBlocked"
    `).catch(() => ([{ riskApps: 0, blockedLinks: 0, adminBlocked: 0 }]));

    const raw = threatResult[0] || {};

    return {
      totalUsers,
      blockedNumbers,
      totalNotifications,
      riskApps: parseInt(raw.riskApps) || 0,
      blockedLinks: parseInt(raw.blockedLinks) || 0,
      adminBlocked: parseInt(raw.adminBlocked) || 0,
    };
  }

  @Get('user/:locksyId')
  async getUserStats(@InjectRepository(BlockedNumber) blockedNumRepo: Repository<BlockedNumber>, locksyId: string) {
    const userBlocked = await blockedNumRepo.count({ where: { userId: locksyId } });
    return { userBlocked };
  }
}
