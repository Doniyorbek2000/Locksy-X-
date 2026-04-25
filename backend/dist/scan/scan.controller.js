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
exports.ScanController = void 0;
const common_1 = require("@nestjs/common");
const scan_service_1 = require("./scan.service");
let ScanController = class ScanController {
    scanService;
    constructor(scanService) {
        this.scanService = scanService;
    }
    scanApk(body) {
        return this.scanService.scanApk(body);
    }
    scanUrl(url) {
        return this.scanService.scanUrl(url);
    }
};
exports.ScanController = ScanController;
__decorate([
    (0, common_1.Post)('apk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScanController.prototype, "scanApk", null);
__decorate([
    (0, common_1.Post)('url'),
    __param(0, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScanController.prototype, "scanUrl", null);
exports.ScanController = ScanController = __decorate([
    (0, common_1.Controller)('scan'),
    __metadata("design:paramtypes", [scan_service_1.ScanService])
], ScanController);
//# sourceMappingURL=scan.controller.js.map