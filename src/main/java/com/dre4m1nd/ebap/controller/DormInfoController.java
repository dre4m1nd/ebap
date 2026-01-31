package com.dre4m1nd.ebap.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dre4m1nd.ebap.common.result.Result;
import com.dre4m1nd.ebap.pojo.entity.DormInfo;
import com.dre4m1nd.ebap.service.IDormInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * @author dre4m1nd
 */
@Tag(name = "宿舍信息管理接口")
@RestController
@RequestMapping("/api/dorm/info")
@AllArgsConstructor
public class DormInfoController {

    private IDormInfoService dormInfoService;

    @Operation(summary = "新增宿舍信息", description = "创建新的宿舍基础信息，包含宿舍编号、电费查询ID、通知阈值等")
    @PostMapping
    public Result<Void> addDormInfo(@RequestBody DormInfo dormInfo) {
        dormInfoService.save(dormInfo);
        return Result.success();
    }

    @Operation(summary = "查询单个宿舍信息", description = "根据ID查询宿舍完整信息")
    @GetMapping("/{id}")
    public Result<DormInfo> getDormInfoById(@PathVariable Long id) {
        return Result.success(dormInfoService.getById(id));
    }

    @Operation(summary = "分页查询宿舍信息", description = "支持宿舍编号、状态筛选，分页查询")
    @GetMapping("/page")
    public Result<Page<DormInfo>> getDormInfoPage(
            @Parameter(description = "页码")
            @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "页大小")
            @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "宿舍编号")
            @RequestParam(required = false) String dormNo,
            @Parameter(description = "状态：1正常/0停用")
            @RequestParam(required = false) Integer status) {

        Page<DormInfo> page = new Page<>(pageNum, pageSize);
        QueryWrapper<DormInfo> queryWrapper = new QueryWrapper<>();

        if (StringUtils.isNotBlank(dormNo)) {
            queryWrapper.eq("dorm_no", dormNo);
        }
        if (status != null) {
            queryWrapper.eq("status", status);
        }

        return Result.success(dormInfoService.page(page, queryWrapper));
    }

    @Operation(summary = "修改宿舍信息", description = "更新宿舍阈值、状态等信息")
    @PutMapping("/{id}")
    public Result<Void> updateDormInfo(@PathVariable Long id, @RequestBody DormInfo dormInfo) {
        dormInfo.setId(id);
        dormInfoService.updateById(dormInfo);
        return Result.success();
    }

    @Operation(summary = "停用/启用宿舍", description = "快捷修改宿舍启用状态")
    @PatchMapping("/{id}/status/{status}")
    public Result<Void> updateDormStatus(@PathVariable Long id, @PathVariable Integer status) {
        DormInfo dormInfo = new DormInfo();
        dormInfo.setId(id);
        dormInfo.setStatus(status);
        dormInfoService.updateById(dormInfo);
        return Result.success();
    }
}
