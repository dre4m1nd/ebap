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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ElectricFetcherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricFetcherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const shared_1 = require("@ebap/shared");
const api_config_1 = __importDefault(require("../../config/api.config"));
const electric_log_entity_1 = require("./entities/electric-log.entity");
const dorm_entity_1 = require("../dorm/entities/dorm.entity");
let ElectricFetcherService = ElectricFetcherService_1 = class ElectricFetcherService {
    constructor(electricRepo, httpService, dormRepo) {
        this.electricRepo = electricRepo;
        this.httpService = httpService;
        this.dormRepo = dormRepo;
        this.logger = new common_1.Logger(ElectricFetcherService_1.name);
    }
    async fetchAndStore(dorm, meterType) {
        const config = (0, api_config_1.default)();
        const path = meterType === shared_1.MeterType.AIR ? config.airPath : config.lightPath;
        const url = `${config.baseUrl}${path}`.replace('{openId}', dorm.openId);
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { timeout: config.timeout }));
            const electricLog = this.electricRepo.create({
                dormId: dorm.id,
                meterType,
                leftMoney: data.leftMoney ?? data.money ?? 0,
                leftEle: data.leftEle ?? data.ele ?? data.electric ?? 0,
                queryTime: data.queryTime ? new Date(data.queryTime) : new Date(),
            });
            return this.electricRepo.save(electricLog);
        }
        catch (error) {
            this.logger.error(`查询宿舍 ${dorm.dormNo} 电费失败 (meterType=${meterType}): ${error.message}`);
            return null;
        }
    }
};
exports.ElectricFetcherService = ElectricFetcherService;
exports.ElectricFetcherService = ElectricFetcherService = ElectricFetcherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(electric_log_entity_1.ElectricLog)),
    __param(2, (0, typeorm_1.InjectRepository)(dorm_entity_1.Dorm)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        typeorm_2.Repository])
], ElectricFetcherService);
//# sourceMappingURL=electric-fetcher.service.js.map