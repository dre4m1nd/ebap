package com.dre4m1nd.ebap.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dre4m1nd.ebap.common.result.Result;
import com.dre4m1nd.ebap.pojo.entity.DormStudent;
import com.dre4m1nd.ebap.service.IDormStudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * @author dre4m1nd
 */
@Tag(name = "学生信息管理接口")
@RestController
@RequestMapping("/api/dorm/student")
@AllArgsConstructor
public class DormStudentController {

    private IDormStudentService studentService;

    @Operation(summary = "新增宿舍学生", description = "添加学生与宿舍的关联，记录邮箱、通知状态")
    @PostMapping
    public Result<Void> addStudent(@RequestBody DormStudent student) {
        studentService.save(student);
        return Result.success();
    }

    @Operation(summary = "查询单个宿舍的学生", description = "查询指定宿舍下的所有学生")
    @GetMapping("/dorm/{dormId}")
    public Result<List<DormStudent>> getStudentsByDormId(@PathVariable Long dormId) {
        QueryWrapper<DormStudent> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("dorm_id", dormId);
        return Result.success(studentService.list(queryWrapper));
    }

    @Operation(summary = "查询单个学生信息", description = "根据学生ID查询详情")
    @GetMapping("/{id}")
    public Result<DormStudent> getStudentById(@PathVariable Long id) {
        return Result.success(studentService.getById(id));
    }

    @Operation(summary = "修改学生信息", description = "更新学生邮箱、昵称、通知状态等")
    @PutMapping("/{id}")
    public Result<Void> updateStudent(@PathVariable Long id, @RequestBody DormStudent student) {
        student.setId(id);
        studentService.updateById(student);
        return Result.success();
    }

    @Operation(summary = "修改学生通知状态", description = "快捷开关学生的电费通知接收状态")
    @PatchMapping("/{id}/status/{status}")
    public Result<Void> updateStudentStatus(@PathVariable Long id, @PathVariable Integer status) {
        DormStudent student = new DormStudent();
        student.setId(id);
        student.setStatus(status);
        studentService.updateById(student);
        return Result.success();
    }

    @Operation(summary = "删除学生", description = "移除宿舍下的学生")
    @DeleteMapping("/{id}")
    public Result<Void> deleteStudent(@PathVariable Long id) {
        studentService.removeById(id);
        return Result.success();
    }
}
