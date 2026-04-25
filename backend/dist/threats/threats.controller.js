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
exports.ThreatsController = void 0;
const common_1 = require("@nestjs/common");
const threats_service_1 = require("./threats.service");
let ThreatsController = class ThreatsController {
    threatsService;
    constructor(threatsService) {
        this.threatsService = threatsService;
    }
    checkApp(packageName) {
        return this.threatsService.checkApp(packageName);
    }
    checkUrl(domain) {
        return this.threatsService.checkUrl(domain);
    }
    addApp(body) {
        return this.threatsService.addThreatApp(body);
    }
    updateApp(id, body) {
        return this.threatsService.updateThreatApp(id, body);
    }
    deleteApp(id) {
        return this.threatsService.deleteThreatApp(id);
    }
    addUrl(body) {
        return this.threatsService.addThreatUrl(body);
    }
    updateUrl(id, body) {
        return this.threatsService.updateThreatUrl(id, body);
    }
    deleteUrl(id) {
        return this.threatsService.deleteThreatUrl(id);
    }
    getAllApps() {
        return this.threatsService.getAllThreatApps();
    }
    getAllUrls() {
        return this.threatsService.getAllThreatUrls();
    }
};
exports.ThreatsController = ThreatsController;
__decorate([
    (0, common_1.Get)('app/:packageName'),
    __param(0, (0, common_1.Param)('packageName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "checkApp", null);
__decorate([
    (0, common_1.Get)('url/:domain'),
    __param(0, (0, common_1.Param)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "checkUrl", null);
__decorate([
    (0, common_1.Post)('app'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "addApp", null);
__decorate([
    (0, common_1.Put)('app/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "updateApp", null);
__decorate([
    (0, common_1.Delete)('app/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "deleteApp", null);
__decorate([
    (0, common_1.Post)('url'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "addUrl", null);
__decorate([
    (0, common_1.Put)('url/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "updateUrl", null);
__decorate([
    (0, common_1.Delete)('url/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "deleteUrl", null);
__decorate([
    (0, common_1.Get)('apps/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "getAllApps", null);
__decorate([
    (0, common_1.Get)('urls/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThreatsController.prototype, "getAllUrls", null);
exports.ThreatsController = ThreatsController = __decorate([
    (0, common_1.Controller)('threats'),
    __metadata("design:paramtypes", [threats_service_1.ThreatsService])
], ThreatsController);
//# sourceMappingURL=threats.controller.js.map