package com.dre4m1nd.ebap.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dre4m1nd.ebap.mapper.DormStudentMapper;
import com.dre4m1nd.ebap.pojo.entity.DormStudent;
import com.dre4m1nd.ebap.service.IDormStudentService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 学生信息表 服务实现类
 * </p>
 *
 * @author dre4m1nd
 * @since 2026-01-30
 */
@Service
public class DormStudentServiceImpl extends ServiceImpl<DormStudentMapper, DormStudent> implements IDormStudentService {

    @Override
    public List<DormStudent> getByDormId(Long dormId) {
        LambdaQueryWrapper<DormStudent> wrapper = new LambdaQueryWrapper<DormStudent>()
                .eq(DormStudent::getDormId, dormId);
        return this.list(wrapper);
    }
}
