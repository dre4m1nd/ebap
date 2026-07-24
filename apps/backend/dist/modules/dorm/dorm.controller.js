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
exports.DormController = void 0;
const common_1 = require("@nestjs/common");
const dorm_service_1 = require("./dorm.service");
const create_dorm_dto_1 = require("./dto/create-dorm.dto");
const update_dorm_dto_1 = require("./dto/update-dorm.dto");
const query_dorm_dto_1 = require("./dto/query-dorm.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let DormController = class DormController {
    constructor(dormService) {
        this.dormService = dormService;
    }
    list() {
        return this.dormService.list();
    }
    page(query) {
        return this.dormService.page(query);
    }
    create(dto) {
        return this.dormService.create(dto);
    }
    update(id, dto) {
        return this.dormService.update(+id, dto);
    }
    remove(id) {
        return this.dormService.remove(+id);
    }
};
exports.DormController = DormController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('dorm/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DormController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('dorm/page'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dorm_dto_1.QueryDormDto]),
    __metadata("design:returntype", void 0)
], DormController.prototype, "page", null);
__decorate([
    (0, common_1.Post)('dorm/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dorm_dto_1.CreateDormDto]),
    __metadata("design:returntype", void 0)
], DormController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('dorm/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dorm_dto_1.UpdateDormDto]),
    __metadata("design:returntype", void 0)
], DormController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('dorm/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DormController.prototype, "remove", null);
exports.DormController = DormController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [dorm_service_1.DormService])
], DormController);
//# sourceMappingURL=dorm.controller.js.map