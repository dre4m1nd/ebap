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
exports.EmailLog = void 0;
const typeorm_1 = require("typeorm");
const dorm_entity_1 = require("../../dorm/entities/dorm.entity");
const student_entity_1 = require("../../student/entities/student.entity");
let EmailLog = class EmailLog {
};
exports.EmailLog = EmailLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmailLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmailLog.prototype, "dormId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dorm_entity_1.Dorm),
    (0, typeorm_1.JoinColumn)({ name: 'dormId' }),
    __metadata("design:type", dorm_entity_1.Dorm)
], EmailLog.prototype, "dorm", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmailLog.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", student_entity_1.Student)
], EmailLog.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { nullable: true }),
    __metadata("design:type", Number)
], EmailLog.prototype, "meterType", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { default: 1 }),
    __metadata("design:type", Number)
], EmailLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmailLog.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], EmailLog.prototype, "sendTime", void 0);
exports.EmailLog = EmailLog = __decorate([
    (0, typeorm_1.Entity)('email_log')
], EmailLog);
//# sourceMappingURL=email-log.entity.js.map