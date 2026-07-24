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
exports.ElectricService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const electric_log_entity_1 = require("./entities/electric-log.entity");
let ElectricService = class ElectricService {
    constructor(electricRepo) {
        this.electricRepo = electricRepo;
    }
    async page(query) {
        const { dormId, type, pageNum, pageSize, startTime, endTime } = query;
        const where = { dormId, meterType: type };
        if (startTime && endTime) {
            where.queryTime = (0, typeorm_2.Between)(new Date(startTime), new Date(endTime));
        }
        else if (startTime) {
            where.queryTime = (0, typeorm_2.MoreThanOrEqual)(new Date(startTime));
        }
        else if (endTime) {
            where.queryTime = (0, typeorm_2.LessThanOrEqual)(new Date(endTime));
        }
        const [records, total] = await this.electricRepo.findAndCount({
            where,
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            order: { queryTime: 'DESC' },
        });
        return {
            records,
            total,
            size: pageSize,
            current: pageNum,
            pages: Math.ceil(total / pageSize),
        };
    }
    async chart(query) {
        const { dormId, type, timeRange } = query;
        let hours;
        switch (timeRange) {
            case '24h':
                hours = 24;
                break;
            case '7d':
                hours = 168;
                break;
            case '30d':
                hours = 720;
                break;
            default: hours = 24;
        }
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        const records = await this.electricRepo.find({
            where: {
                dormId,
                meterType: type,
                queryTime: (0, typeorm_2.MoreThanOrEqual)(since),
            },
            order: { queryTime: 'ASC' },
        });
        return records.map((r) => ({
            leftElectric: r.leftEle.toString(),
            leftMoney: r.leftMoney.toString(),
            time: r.queryTime.toISOString(),
        }));
    }
};
exports.ElectricService = ElectricService;
exports.ElectricService = ElectricService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(electric_log_entity_1.ElectricLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ElectricService);
//# sourceMappingURL=electric.service.js.map