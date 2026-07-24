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
exports.ElectricController = void 0;
const common_1 = require("@nestjs/common");
const electric_service_1 = require("./electric.service");
const query_electric_log_dto_1 = require("./dto/query-electric-log.dto");
const query_electric_chart_dto_1 = require("./dto/query-electric-chart.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let ElectricController = class ElectricController {
    constructor(electricService) {
        this.electricService = electricService;
    }
    page(query) {
        return this.electricService.page(query);
    }
    chart(query) {
        return this.electricService.chart(query);
    }
};
exports.ElectricController = ElectricController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('electric/list'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_electric_log_dto_1.QueryElectricLogDto]),
    __metadata("design:returntype", void 0)
], ElectricController.prototype, "page", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('electric/chart'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_electric_chart_dto_1.QueryElectricChartDto]),
    __metadata("design:returntype", void 0)
], ElectricController.prototype, "chart", null);
exports.ElectricController = ElectricController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [electric_service_1.ElectricService])
], ElectricController);
//# sourceMappingURL=electric.controller.js.map