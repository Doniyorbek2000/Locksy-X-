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
exports.BlockedNumbersController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blocked_number_entity_1 = require("./entities/blocked-number.entity");
let BlockedNumbersController = class BlockedNumbersController {
    blockedNumberRepository;
    constructor(blockedNumberRepository) {
        this.blockedNumberRepository = blockedNumberRepository;
    }
    getAllGlobal() {
        return this.blockedNumberRepository.find({ where: { userId: 'admin' }, order: { createdAt: 'DESC' } });
    }
    getUserBlocked(locksyId) {
        return this.blockedNumberRepository.find({ where: [{ userId: 'admin' }, { userId: locksyId }], order: { createdAt: 'DESC' } });
    }
    async create(body) {
        const existing = await this.blockedNumberRepository.findOne({ where: { number: body.number, userId: body.userId || 'admin' } });
        if (existing)
            return existing;
        const bn = this.blockedNumberRepository.create({ number: body.number, userId: body.userId || 'admin' });
        return this.blockedNumberRepository.save(bn);
    }
    async update(id, body) {
        await this.blockedNumberRepository.update(id, body);
        return this.blockedNumberRepository.findOne({ where: { id } });
    }
    async delete(id) {
        await this.blockedNumberRepository.delete(id);
        return { success: true };
    }
};
exports.BlockedNumbersController = BlockedNumbersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlockedNumbersController.prototype, "getAllGlobal", null);
__decorate([
    (0, common_1.Get)('user/:locksyId'),
    __param(0, (0, common_1.Param)('locksyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlockedNumbersController.prototype, "getUserBlocked", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockedNumbersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlockedNumbersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockedNumbersController.prototype, "delete", null);
exports.BlockedNumbersController = BlockedNumbersController = __decorate([
    (0, common_1.Controller)('blocked-numbers'),
    __param(0, (0, typeorm_1.InjectRepository)(blocked_number_entity_1.BlockedNumber)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlockedNumbersController);
//# sourceMappingURL=blocked-numbers.controller.js.map