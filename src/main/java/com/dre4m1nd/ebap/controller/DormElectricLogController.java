package com.dre4m1nd.ebap.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dre4m1nd.ebap.common.result.Result;
import com.dre4m1nd.ebap.pojo.entity.DormElectricLog;
import com.dre4m1nd.ebap.service.IDormElectricLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * @author dre4m1nd
 */
@RestController
@RequestMapping("/api/dorm/electric/log")
@AllArgsConstructor
@Tag(name = "电费日志接口")
public class DormElectricLogController {

    private IDormElectricLogService electricLogService;

    @Operation(summary = "新增电费日志", description = "记录从电费接口查询到的原始数据")
    @PostMapping
    public Result<Void> addElectricLog(@RequestBody DormElectricLog log) {
        electricLogService.save(log);
        return Result.success();
    }

    @Operation(summary = "查询单个宿舍的电费日志", description = "按宿舍ID筛选，可指定电表类型")
    @GetMapping("/dorm/{dormId}")
    public Result<List<DormElectricLog>> getLogsByDormId(@PathVariable Long dormId,
                                                 @Parameter(description = "电表类型：1照明/2空调")
                                                 @RequestParam(required = false) Integer meterType) {
        QueryWrapper<DormElectricLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("dorm_id", dormId);
        if (meterType != null) {
            queryWrapper.eq("meter_type", meterType);
        }
        queryWrapper.orderByDesc("create_time");
        return Result.success(electricLogService.list(queryWrapper));
    }

    @Operation(summary = "分页查询电费日志", description = "多条件筛选电费日志，支持时间范围")
    @GetMapping("/page")
    public Result<Page<DormElectricLog>> getElectricLogPage(
            @Parameter(description = "页码")
            @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "页大小")
            @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "宿舍ID")
            @RequestParam(required = false) Long dormId,
            @Parameter(description = "电表类型：1照明/2空调")
            @RequestParam(required = false) Integer meterType,
            @Parameter(description = "开始时间")
            @RequestParam(required = false) String startTime,
            @Parameter(description = "结束时间")
            @RequestParam(required = false) String endTime) {

        Page<DormElectricLog> page = new Page<>(pageNum, pageSize);
        QueryWrapper<DormElectricLog> queryWrapper = new QueryWrapper<>();

        if (dormId != null) {
            queryWrapper.eq("dorm_id", dormId);
        }
        if (meterType != null) {
            queryWrapper.eq("meter_type", meterType);
        }
        if (StringUtils.isNotBlank(startTime)) {
            queryWrapper.ge("create_time", startTime);
        }
        if (StringUtils.isNotBlank(endTime)) {
            queryWrapper.le("create_time", endTime);
        }

        return Result.success(electricLogService.page(page, queryWrapper));
    }

    @Operation(summary = "查询最新电费记录", description = "获取指定宿舍最新的电费（照明/空调）记录，用于前端展示实时数据")
    @GetMapping("/latest/dorm/{dormId}")
    public Result<DormElectricLog> getLatestElectricLog(@PathVariable Long dormId,
                                                @Parameter(description = "电表类型：1照明/2空调")
                                                @RequestParam(required = false) Integer meterType) {
        QueryWrapper<DormElectricLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("dorm_id", dormId);
        if (meterType != null) {
            queryWrapper.eq("meter_type", meterType);
        }
        queryWrapper.orderByDesc("create_time").last("LIMIT 1");
        return Result.success(electricLogService.getOne(queryWrapper));
    }
}
