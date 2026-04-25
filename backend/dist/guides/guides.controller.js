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
exports.GuidesController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guide_entity_1 = require("./entities/guide.entity");
let GuidesController = class GuidesController {
    guideRepository;
    constructor(guideRepository) {
        this.guideRepository = guideRepository;
    }
    getAllGuides() {
        return this.guideRepository.find({ order: { lang: 'ASC' } });
    }
    async getGuide(lang) {
        const guide = await this.guideRepository.findOne({ where: { lang } });
        if (!guide)
            return { content: 'No guide available.' };
        return guide;
    }
    async updateGuide(body) {
        let guide = await this.guideRepository.findOne({ where: { lang: body.lang } });
        if (!guide) {
            guide = this.guideRepository.create(body);
        }
        else {
            guide.content = body.content;
        }
        return this.guideRepository.save(guide);
    }
};
exports.GuidesController = GuidesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuidesController.prototype, "getAllGuides", null);
__decorate([
    (0, common_1.Get)(':lang'),
    __param(0, (0, common_1.Param)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuidesController.prototype, "getGuide", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuidesController.prototype, "updateGuide", null);
exports.GuidesController = GuidesController = __decorate([
    (0, common_1.Controller)('guides'),
    __param(0, (0, typeorm_1.InjectRepository)(guide_entity_1.Guide)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GuidesController);
//# sourceMappingURL=guides.controller.js.map