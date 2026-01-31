package com.dre4m1nd.ebap.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.dre4m1nd.ebap.pojo.entity.DormStudent;

import java.util.List;

/**
 * <p>
 * 学生信息表 服务类
 * </p>
 *
 * @author dre4m1nd
 * @since 2026-01-30
 */
public interface IDormStudentService extends IService<DormStudent> {

    List<DormStudent> getByDormId(Long dormId);
}
