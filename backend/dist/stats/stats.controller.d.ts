import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlockedNumber } from '../blocked-numbers/entities/blocked-number.entity';
import { Notification } from '../notifications/entities/notification.entity';
export declare class StatsController {
    private userRepo;
    private blockedNumRepo;
    private notifRepo;
    constructor(userRepo: Repository<User>, blockedNumRepo: Repository<BlockedNumber>, notifRepo: Repository<Notification>);
    getStats(): Promise<{
        totalUsers: number;
        blockedNumbers: number;
        totalNotifications: number;
        riskApps: number;
        blockedLinks: number;
        adminBlocked: number;
    }>;
    getUserStats(blockedNumRepo: Repository<BlockedNumber>, locksyId: string): Promise<{
        userBlocked: number;
    }>;
}
