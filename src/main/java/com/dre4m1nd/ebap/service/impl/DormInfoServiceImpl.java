package com.dre4m1nd.ebap.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dre4m1nd.ebap.mapper.DormInfoMapper;
import com.dre4m1nd.ebap.pojo.entity.DormInfo;
import com.dre4m1nd.ebap.service.IDormInfoService;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 宿舍信息主表 服务实现类
 * </p>
 *
 * @author dre4m1nd
 * @since 2026-01-30
 */
@Service
public class DormInfoServiceImpl extends ServiceImpl<DormInfoMapper, DormInfo> implements IDormInfoService {

}
