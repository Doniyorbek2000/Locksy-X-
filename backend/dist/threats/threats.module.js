"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreatsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const threats_service_1 = require("./threats.service");
const threats_controller_1 = require("./threats.controller");
const threat_app_entity_1 = require("./entities/threat-app.entity");
const threat_url_entity_1 = require("./entities/threat-url.entity");
let ThreatsModule = class ThreatsModule {
};
exports.ThreatsModule = ThreatsModule;
exports.ThreatsModule = ThreatsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([threat_app_entity_1.ThreatApp, threat_url_entity_1.ThreatUrl])],
        controllers: [threats_controller_1.ThreatsController],
        providers: [threats_service_1.ThreatsService],
        exports: [threats_service_1.ThreatsService],
    })
], ThreatsModule);
//# sourceMappingURL=threats.module.js.map