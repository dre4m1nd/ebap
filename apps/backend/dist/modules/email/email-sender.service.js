"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailSenderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nodemailer = __importStar(require("nodemailer"));
const shared_1 = require("@ebap/shared");
const mail_config_1 = __importDefault(require("../../config/mail.config"));
const email_log_entity_1 = require("./entities/email-log.entity");
let EmailSenderService = EmailSenderService_1 = class EmailSenderService {
    constructor(emailRepo) {
        this.emailRepo = emailRepo;
        this.logger = new common_1.Logger(EmailSenderService_1.name);
    }
    async sendWarning(student, dorm, meterType, leftValue, threshold) {
        try {
            const config = (0, mail_config_1.default)();
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.port === 465,
                auth: {
                    user: config.user,
                    pass: config.pass,
                },
            });
            const typeLabel = meterType === shared_1.MeterType.AIR ? '空调' : '照明';
            const subject = `【电费预警】${dorm.dormNo} 宿舍剩余电量不足`;
            const content = `${dorm.dormNo} 宿舍的${typeLabel}剩余电量已低于预警阈值：\n\n剩余电量：${leftValue} 度\n预警阈值：${threshold} 度\n\n请及时充值！`;
            await transporter.sendMail({
                from: config.from,
                to: student.email,
                subject,
                text: content,
            });
            const emailLog = this.emailRepo.create({
                dormId: dorm.id,
                studentId: student.id,
                meterType,
                status: shared_1.CommonStatus.ACTIVE,
                content,
                sendTime: new Date(),
            });
            return this.emailRepo.save(emailLog);
        }
        catch (error) {
            this.logger.error(`发送告警邮件失败 (student=${student.id}, dorm=${dorm.dormNo}): ${error.message}`);
            const emailLog = this.emailRepo.create({
                dormId: dorm.id,
                studentId: student.id,
                meterType,
                status: shared_1.CommonStatus.DISABLED,
                content: error.message,
                sendTime: new Date(),
            });
            return this.emailRepo.save(emailLog);
        }
    }
};
exports.EmailSenderService = EmailSenderService;
exports.EmailSenderService = EmailSenderService = EmailSenderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_log_entity_1.EmailLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmailSenderService);
//# sourceMappingURL=email-sender.service.js.map