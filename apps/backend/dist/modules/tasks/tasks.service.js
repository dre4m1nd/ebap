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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shared_1 = require("@ebap/shared");
const dorm_service_1 = require("../dorm/dorm.service");
const student_service_1 = require("../student/student.service");
const electric_fetcher_service_1 = require("../electric/electric-fetcher.service");
const email_sender_service_1 = require("../email/email-sender.service");
const electric_log_entity_1 = require("../electric/entities/electric-log.entity");
const email_log_entity_1 = require("../email/entities/email-log.entity");
let TasksService = TasksService_1 = class TasksService {
    constructor(dormService, studentService, electricFetcher, emailSender, electricRepo, emailRepo) {
        this.dormService = dormService;
        this.studentService = studentService;
        this.electricFetcher = electricFetcher;
        this.emailSender = emailSender;
        this.electricRepo = electricRepo;
        this.emailRepo = emailRepo;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async handleElectricFetch() {
        this.logger.log('开始定时电费查询任务');
        const dorms = await this.dormService.list();
        const activeDorms = dorms.filter((d) => d.status === shared_1.CommonStatus.ACTIVE && d.openId);
        if (activeDorms.length === 0) {
            this.logger.log('没有可查询的活跃宿舍');
            return;
        }
        for (const dorm of activeDorms) {
            await this.processDorm(dorm).catch((error) => {
                this.logger.error(`宿舍 ${dorm.dormNo} 处理异常: ${error.message}`);
            });
        }
        this.logger.log('定时电费查询任务结束');
    }
    async processDorm(dorm) {
        for (const meterType of [shared_1.MeterType.LIGHT, shared_1.MeterType.AIR]) {
            if (await this.shouldSkipElectric(dorm.id, meterType)) {
                continue;
            }
            const log = await this.electricFetcher.fetchAndStore(dorm, meterType);
            if (!log)
                continue;
            await this.checkAndAlert(dorm, log, meterType);
        }
    }
    async shouldSkipElectric(dormId, meterType) {
        const recent = await this.electricRepo.findOne({
            where: {
                dormId,
                meterType,
                queryTime: (0, typeorm_2.MoreThanOrEqual)(new Date(Date.now() - 55 * 60 * 1000)),
            },
        });
        return !!recent;
    }
    async checkAndAlert(dorm, log, meterType) {
        const threshold = meterType === shared_1.MeterType.AIR ? dorm.limitAir : dorm.limitLight;
        if (!threshold || Number(threshold) === 0)
            return;
        const leftValue = Number(log.leftEle);
        if (leftValue >= Number(threshold))
            return;
        const typeLabel = meterType === shared_1.MeterType.AIR ? '空调' : '照明';
        this.logger.log(`${dorm.dormNo} ${typeLabel} 低于阈值 (剩余=${leftValue}, 阈值=${threshold})`);
        const students = await this.studentService.list(dorm.id);
        const activeStudents = students.filter((s) => s.status === shared_1.CommonStatus.ACTIVE);
        for (const student of activeStudents) {
            if (await this.shouldSkipAlert(student.id, dorm.id, meterType)) {
                continue;
            }
            await this.emailSender.sendWarning(student, dorm, meterType, String(leftValue), Number(threshold));
        }
    }
    async shouldSkipAlert(studentId, dormId, meterType) {
        const recent = await this.emailRepo.findOne({
            where: {
                studentId,
                dormId,
                meterType,
                status: shared_1.CommonStatus.ACTIVE,
                sendTime: (0, typeorm_2.MoreThanOrEqual)(new Date(Date.now() - 24 * 60 * 60 * 1000)),
            },
        });
        return !!recent;
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)(process.env.ELECTRIC_FETCH_CRON || '0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handleElectricFetch", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(electric_log_entity_1.ElectricLog)),
    __param(5, (0, typeorm_1.InjectRepository)(email_log_entity_1.EmailLog)),
    __metadata("design:paramtypes", [dorm_service_1.DormService,
        student_service_1.StudentService,
        electric_fetcher_service_1.ElectricFetcherService,
        email_sender_service_1.EmailSenderService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map