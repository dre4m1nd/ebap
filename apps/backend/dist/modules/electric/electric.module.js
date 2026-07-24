"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const electric_log_entity_1 = require("./entities/electric-log.entity");
const dorm_entity_1 = require("../dorm/entities/dorm.entity");
const electric_controller_1 = require("./electric.controller");
const electric_service_1 = require("./electric.service");
const electric_fetcher_service_1 = require("./electric-fetcher.service");
let ElectricModule = class ElectricModule {
};
exports.ElectricModule = ElectricModule;
exports.ElectricModule = ElectricModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([electric_log_entity_1.ElectricLog, dorm_entity_1.Dorm]),
            axios_1.HttpModule,
        ],
        controllers: [electric_controller_1.ElectricController],
        providers: [electric_service_1.ElectricService, electric_fetcher_service_1.ElectricFetcherService],
        exports: [electric_service_1.ElectricService, electric_fetcher_service_1.ElectricFetcherService],
    })
], ElectricModule);
//# sourceMappingURL=electric.module.js.map