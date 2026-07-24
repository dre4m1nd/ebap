"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const dorm_module_1 = require("../dorm/dorm.module");
const student_module_1 = require("../student/student.module");
const electric_module_1 = require("../electric/electric.module");
const email_module_1 = require("../email/email.module");
const electric_log_entity_1 = require("../electric/entities/electric-log.entity");
const email_log_entity_1 = require("../email/entities/email-log.entity");
const tasks_service_1 = require("./tasks.service");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([electric_log_entity_1.ElectricLog, email_log_entity_1.EmailLog]),
            dorm_module_1.DormModule,
            student_module_1.StudentModule,
            electric_module_1.ElectricModule,
            email_module_1.EmailModule,
        ],
        providers: [tasks_service_1.TasksService],
    })
], TasksModule);
//# sourceMappingURL=tasks.module.js.map