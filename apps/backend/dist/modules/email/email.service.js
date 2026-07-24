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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_log_entity_1 = require("./entities/email-log.entity");
let EmailService = class EmailService {
    constructor(emailRepo) {
        this.emailRepo = emailRepo;
    }
    async page(query) {
        const { pageNum, pageSize, dormId, studentId, startTime, endTime } = query;
        const where = {};
        if (dormId)
            where.dormId = dormId;
        if (studentId)
            where.studentId = studentId;
        if (startTime && endTime) {
            where.sendTime = (0, typeorm_2.Between)(new Date(startTime), new Date(endTime));
        }
        else if (startTime) {
            where.sendTime = (0, typeorm_2.MoreThanOrEqual)(new Date(startTime));
        }
        else if (endTime) {
            where.sendTime = (0, typeorm_2.LessThanOrEqual)(new Date(endTime));
        }
        const [records, total] = await this.emailRepo.findAndCount({
            where,
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
            order: { sendTime: 'DESC' },
        });
        return {
            records,
            total,
            size: pageSize,
            current: pageNum,
            pages: Math.ceil(total / pageSize),
        };
    }
    async update(id, dto) {
        const log = await this.emailRepo.findOneBy({ id });
        if (!log)
            throw new common_1.NotFoundException('邮件记录不存在');
        await this.emailRepo.update(id, dto);
        return this.emailRepo.findOneBy({ id });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_log_entity_1.EmailLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmailService);
//# sourceMappingURL=email.service.js.map