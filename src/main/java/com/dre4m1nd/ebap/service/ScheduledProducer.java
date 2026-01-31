package com.dre4m1nd.ebap.service;

import com.dre4m1nd.ebap.config.RabbitMQConfig;
import com.dre4m1nd.ebap.pojo.entity.DormInfo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author dre4m1nd
 * @since 2026/1/30
 */
@AllArgsConstructor
@Slf4j
@Service
public class ScheduledProducer {

    private IDormInfoService dormInfoService;
    private RabbitTemplate rabbitTemplate;

    @Scheduled(cron = "*/30 * * * * ?")
    private void queryInfoProducer() {
        List<DormInfo> list = dormInfoService.list();
        if (list.isEmpty()) {
            log.warn("没有需要查询的宿舍信息");
        }
        log.info("[宿舍信息MQ]开始发送信息, 共{}个", list.size());
        list.forEach(dormInfo -> {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ELECTRIC_EXCHANGE,
                    RabbitMQConfig.ELECTRIC_QUERY_ROUTING_KEY,
                    dormInfo
            );
        });
        log.info("[宿舍信息MQ]发送完成");
    }

}
