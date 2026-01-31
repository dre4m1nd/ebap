package com.dre4m1nd.ebap.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dre4m1nd.ebap.common.result.Result;
import com.dre4m1nd.ebap.pojo.entity.DormEmailLog;
import com.dre4m1nd.ebap.service.IDormEmailLogService;
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
@Tag(name = "邮件日志管理接口")
@RestController
@RequestMapping("/api/dorm/email/log")
@AllArgsConstructor
public class DormEmailLogController {

    private IDormEmailLogService emailLogService;

    @Operation(summary = "新增邮件发送日志", description = "记录邮件发送（成功/失败）的日志")
    @PostMapping
    public Result<Void> addEmailLog(@RequestBody DormEmailLog log) {
        emailLogService.save(log);
        return Result.success();
    }

    @Operation(summary = "查询单个宿舍的邮件日志", description = "查询指定宿舍的所有邮件发送记录")
    @GetMapping("/dorm/{dormId}")
    public Result<List<DormEmailLog>> getEmailLogsByDormId(@PathVariable Long dormId) {
        QueryWrapper<DormEmailLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("dorm_id", dormId);
        queryWrapper.orderByDesc("create_time");
        return Result.success(emailLogService.list(queryWrapper));
    }

    @Operation(summary = "分页查询邮件日志", description = "多条件筛选邮件发送日志")
    @GetMapping("/page")
    public Result<Page<DormEmailLog>> getEmailLogPage(
            @Parameter(description = "页码")
            @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "页大小")
            @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "宿舍ID")
            @RequestParam(required = false) Long dormId,
            @Parameter(description = "学生ID")
            @RequestParam(required = false) Long studentId,
            @Parameter(description = "开始时间")
            @RequestParam(required = false) String startTime,
            @Parameter(description = "结束时间")
            @RequestParam(required = false) String endTime) {

        Page<DormEmailLog> page = new Page<>(pageNum, pageSize);
        QueryWrapper<DormEmailLog> queryWrapper = new QueryWrapper<>();

        if (dormId != null) {
            queryWrapper.eq("dorm_id", dormId);
        }
        if (studentId != null) {
            queryWrapper.eq("student_id", studentId);
        }
        if (StringUtils.isNotBlank(startTime)) {
            queryWrapper.ge("create_time", startTime);
        }
        if (StringUtils.isNotBlank(endTime)) {
            queryWrapper.le("create_time", endTime);
        }

        return Result.success(emailLogService.page(page, queryWrapper));
    }
}
