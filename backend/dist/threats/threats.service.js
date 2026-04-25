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
exports.ThreatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const threat_app_entity_1 = require("./entities/threat-app.entity");
const threat_url_entity_1 = require("./entities/threat-url.entity");
let ThreatsService = class ThreatsService {
    threatAppRepository;
    threatUrlRepository;
    constructor(threatAppRepository, threatUrlRepository) {
        this.threatAppRepository = threatAppRepository;
        this.threatUrlRepository = threatUrlRepository;
    }
    async checkApp(packageName) {
        return this.threatAppRepository.findOne({ where: { packageName } });
    }
    async checkUrl(domain) {
        return this.threatUrlRepository.findOne({ where: { domain } });
    }
    async addThreatApp(data) {
        const app = this.threatAppRepository.create(data);
        return this.threatAppRepository.save(app);
    }
    async addThreatUrl(data) {
        const url = this.threatUrlRepository.create(data);
        return this.threatUrlRepository.save(url);
    }
    async getAllThreatApps() {
        return this.threatAppRepository.find({ order: { createdAt: 'DESC' }, take: 50 });
    }
    async getAllThreatUrls() {
        return this.threatUrlRepository.find({ order: { createdAt: 'DESC' }, take: 100 });
    }
    async updateThreatUrl(id, data) {
        await this.threatUrlRepository.update(id, data);
        return this.threatUrlRepository.findOne({ where: { id } });
    }
    async deleteThreatUrl(id) {
        await this.threatUrlRepository.delete(id);
    }
    async updateThreatApp(id, data) {
        await this.threatAppRepository.update(id, data);
        return this.threatAppRepository.findOne({ where: { id } });
    }
    async deleteThreatApp(id) {
        await this.threatAppRepository.delete(id);
    }
};
exports.ThreatsService = ThreatsService;
exports.ThreatsService = ThreatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(threat_app_entity_1.ThreatApp)),
    __param(1, (0, typeorm_1.InjectRepository)(threat_url_entity_1.ThreatUrl)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ThreatsService);
//# sourceMappingURL=threats.service.js.map