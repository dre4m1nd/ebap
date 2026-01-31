DROP DATABASE IF EXISTS dorm_electric_fee;

CREATE DATABASE IF NOT EXISTS `dorm_electric_fee` DEFAULT CHARACTER SET utf8mb4;
USE dorm_electric_fee;

-- 1. 宿舍信息主表【补充：open_id唯一索引（避免查询编号重复）】
CREATE TABLE `dorm_info`
(
    `id`          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `dorm_no`     VARCHAR(32) NOT NULL COMMENT '宿舍编号',
    `open_id`     VARCHAR(32) NOT NULL COMMENT '电费查询唯一编号',
    `limit_light` TINYINT     NOT NULL COMMENT '照明通知限度',
    `limit_air`   TINYINT     NOT NULL COMMENT '空调通知限度',
    `status`      TINYINT     NOT NULL DEFAULT 1 COMMENT '1-正常 0-停用',
    `create_time` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dorm_no` (`dorm_no`),
    UNIQUE KEY `uk_open_id` (`open_id`) -- 补充：查询编号唯一，避免重复录入
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='宿舍信息主表';

-- 2. 学生信息表【无修改，保持极简】
CREATE TABLE `dorm_student`
(
    `id`          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `nick_name`   VARCHAR(32) NOT NULL COMMENT '学生昵称',
    `email`       VARCHAR(64)          DEFAULT NULL COMMENT '邮箱',
    `status`      TINYINT     NOT NULL DEFAULT 1 COMMENT '1-接收通知 0-不接收',
    `dorm_id`     BIGINT      NOT NULL COMMENT '关联宿舍ID',
    `create_time` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_dorm_id` (`dorm_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='学生信息表';

-- 3. 电费日志表【补充：query_time非默认值、外键策略完善】
CREATE TABLE `dorm_electric_log`
(
    `id`         BIGINT   NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `dorm_id`    BIGINT   NOT NULL COMMENT '关联宿舍ID',
    `meter_type` TINYINT  NOT NULL COMMENT '1-照明 2-空调',
    `left_money` FLOAT    NOT NULL COMMENT '剩余金额',
    `left_ele`   FLOAT    NOT NULL COMMENT '剩余电量',
    `query_time` DATETIME NOT NULL COMMENT '接口返回时间 monTime',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='电费接口原始记录表';

-- 4. 邮件发送日志
CREATE TABLE `dorm_email_log`
(
    `id`         BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `dorm_id`    BIGINT NOT NULL COMMENT '宿舍ID',
    `student_id` BIGINT NOT NULL COMMENT '学生ID',
    `send_time`  DATETIME DEFAULT NULL COMMENT '发送时间（成功/失败时更新）',
    PRIMARY KEY (`id`),
    KEY `idx_dorm_id` (`dorm_id`),
    KEY `idx_student_id` (`student_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='邮件发送记录表';