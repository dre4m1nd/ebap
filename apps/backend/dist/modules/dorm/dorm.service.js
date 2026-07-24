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
exports.DormService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dorm_entity_1 = require("./entities/dorm.entity");
let DormService = class DormService {
    constructor(dormRepo) {
        this.dormRepo = dormRepo;
    }
    async list() {
        return this.dormRepo.find({ order: { dormNo: 'ASC' } });
    }
    async page(query) {
        const { pageNum, pageSize, dormNo, status } = query;
        const where = {};
        if (dormNo)
            where.dormNo = (0, typeorm_2.Like)(`%${dormNo}%`);
        if (status !== undefined)
            where.status = status;
        const [records, total] = await this.dormRepo.findAndCount({
            where,
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            order: { updateTime: 'DESC' },
        });
        return {
            records,
            total,
            size: pageSize,
            current: pageNum,
            pages: Math.ceil(total / pageSize),
        };
    }
    async create(dto) {
        const dorm = this.dormRepo.create(dto);
        return this.dormRepo.save(dorm);
    }
    async update(id, dto) {
        const dorm = await this.dormRepo.findOneBy({ id });
        if (!dorm)
            throw new common_1.NotFoundException('宿舍不存在');
        await this.dormRepo.update(id, dto);
        return this.dormRepo.findOneBy({ id });
    }
    async remove(id) {
        const dorm = await this.dormRepo.findOneBy({ id });
        if (!dorm)
            throw new common_1.NotFoundException('宿舍不存在');
        await this.dormRepo.delete(id);
    }
};
exports.DormService = DormService;
exports.DormService = DormService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dorm_entity_1.Dorm)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DormService);
//# sourceMappingURL=dorm.service.js.map