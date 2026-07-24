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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricLog = void 0;
const typeorm_1 = require("typeorm");
const dorm_entity_1 = require("../../dorm/entities/dorm.entity");
let ElectricLog = class ElectricLog {
};
exports.ElectricLog = ElectricLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ElectricLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ElectricLog.prototype, "dormId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dorm_entity_1.Dorm),
    (0, typeorm_1.JoinColumn)({ name: 'dormId' }),
    __metadata("design:type", dorm_entity_1.Dorm)
], ElectricLog.prototype, "dorm", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint'),
    __metadata("design:type", Number)
], ElectricLog.prototype, "meterType", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ElectricLog.prototype, "leftMoney", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ElectricLog.prototype, "leftEle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], ElectricLog.prototype, "queryTime", void 0);
exports.ElectricLog = ElectricLog = __decorate([
    (0, typeorm_1.Entity)('electric_log')
], ElectricLog);
//# sourceMappingURL=electric-log.entity.js.map