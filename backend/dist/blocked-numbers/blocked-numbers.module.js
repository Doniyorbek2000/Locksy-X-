"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedNumbersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const blocked_numbers_controller_1 = require("./blocked-numbers.controller");
const blocked_number_entity_1 = require("./entities/blocked-number.entity");
let BlockedNumbersModule = class BlockedNumbersModule {
};
exports.BlockedNumbersModule = BlockedNumbersModule;
exports.BlockedNumbersModule = BlockedNumbersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([blocked_number_entity_1.BlockedNumber])],
        controllers: [blocked_numbers_controller_1.BlockedNumbersController],
    })
], BlockedNumbersModule);
//# sourceMappingURL=blocked-numbers.module.js.map