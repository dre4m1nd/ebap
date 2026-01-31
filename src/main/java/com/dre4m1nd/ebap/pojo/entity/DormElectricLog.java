package com.dre4m1nd.ebap.pojo.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 电费接口原始记录表
 * </p>
 *
 * @author dre4m1nd
 * @since 2026-01-30
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("dorm_electric_log")
public class DormElectricLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 关联宿舍ID
     */
    private Long dormId;

    /**
     * 1-照明 2-空调
     */
    private Integer meterType;

    /**
     * 剩余金额
     */
    private Float leftMoney;

    /**
     * 剩余电量
     */
    private Float leftEle;

    /**
     * 接口返回时间 monTime
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime queryTime;


}
