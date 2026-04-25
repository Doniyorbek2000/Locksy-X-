"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const blocked_number_entity_1 = require("../blocked-numbers/entities/blocked-number.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let StatsController = class StatsController {
    userRepo;
    blockedNumRepo;
    notifRepo;
    constructor(userRepo, blockedNumRepo, notifRepo) {
        this.userRepo = userRepo;
        this.blockedNumRepo = blockedNumRepo;
        this.notifRepo = notifRepo;
    }
    async getStats() {
        const [totalUsers, blockedNumbers, totalNotifications] = await Promise.all([
            this.userRepo.count(),
            this.blockedNumRepo.count(),
            this.notifRepo.count(),
        ]);
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
    async getUserStats(blockedNumRepo, locksyId) {
        const userBlocked = await blockedNumRepo.count({ where: { userId: locksyId } });
        return { userBlocked };
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('user/:locksyId'),
    __param(0, (0, typeorm_1.InjectRepository)(blocked_number_entity_1.BlockedNumber)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_2.Repository, String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getUserStats", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(blocked_number_entity_1.BlockedNumber)),
    __param(2, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatsController);
//# sourceMappingURL=stats.controller.js.map