"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDormDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_dorm_dto_1 = require("./create-dorm.dto");
class UpdateDormDto extends (0, mapped_types_1.PartialType)(create_dorm_dto_1.CreateDormDto) {
}
exports.UpdateDormDto = UpdateDormDto;
//# sourceMappingURL=update-dorm.dto.js.map