package com.dre4m1nd.ebap.config;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author dre4m1nd
 */
@Slf4j
@Configuration
@AllArgsConstructor
public class RabbitTemplateConfig {

    private MessageConverter jackson2JsonMessageConverter;

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        // 1. 消息确认回调（原有配置，保留）
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
                    if (ack) {
                        if (correlationData != null) {
                            log.info("消息发送成功, correlationId: {}", correlationData.getId());
                        }
                    } else {
                        log.error("消息发送失败, 原因: {}", cause);
                    }
                }
        );
        // 2. 消息返回回调（原有配置，保留）
        rabbitTemplate.setReturnsCallback((returnedMessage) -> {
            log.warn("消息发送失败: \n" +
                            "消息: {}\n" +
                            "响应码: {}\n" +
                            "响应信息: {}\n" +
                            "交换机: {}\n" +
                            "路由键: {}",
                    returnedMessage.getMessage(),
                    returnedMessage.getReplyCode(),
                    returnedMessage.getReplyText(),
                    returnedMessage.getExchange(),
                    returnedMessage.getRoutingKey()
            );
        });
        // ===================== 核心新增配置 =====================
        // 为RabbitTemplate绑定JSON消息转换器，覆盖默认Java序列化器
        rabbitTemplate.setMessageConverter(jackson2JsonMessageConverter);
        // ========================================================
        return rabbitTemplate;
    }
}