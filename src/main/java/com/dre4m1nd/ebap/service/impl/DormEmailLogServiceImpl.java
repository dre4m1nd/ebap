package com.dre4m1nd.ebap.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dre4m1nd.ebap.mapper.DormEmailLogMapper;
import com.dre4m1nd.ebap.pojo.entity.DormEmailLog;
import com.dre4m1nd.ebap.service.IDormEmailLogService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 邮件发送记录表 服务实现类
 * </p>
 *
 * @author dre4m1nd
 * @since 2026-01-30
 */
@Service
public class DormEmailLogServiceImpl extends ServiceImpl<DormEmailLogMapper, DormEmailLog> implements IDormEmailLogService {

}
