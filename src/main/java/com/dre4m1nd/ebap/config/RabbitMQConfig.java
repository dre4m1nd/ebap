package com.dre4m1nd.ebap.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author dre4m1nd
 */
@Configuration
public class RabbitMQConfig {

    // ===================== 1. 交换机声明（Direct类型，持久化） =====================
    /** 电费业务核心交换机 */
    public static final String ELECTRIC_EXCHANGE = "electric.exchange";

    // ===================== 2. 队列声明（持久化，非排他，非自动删除） =====================
    /** 电费查询入库队列 */
    public static final String ELECTRIC_QUERY_QUEUE = "electric.query.queue";
    /** 欠费提醒队列 */
    public static final String ELECTRIC_NOTICE_QUEUE = "electric.arrears.queue";

    // ===================== 3. 路由键声明（精准路由，与队列一一对应） =====================
    /** 电费查询路由键 */
    public static final String ELECTRIC_QUERY_ROUTING_KEY = "electric.query.key";
    /** 欠费提醒路由键 */
    public static final String ELECTRIC_NOTICE_ROUTING_KEY = "electric.arrears.key";


    @Bean
    public DirectExchange electricExchange() {
        return new DirectExchange(ELECTRIC_EXCHANGE, true, false);
    }

    @Bean
    public Queue electricQueryQueue() {
        return QueueBuilder.durable(ELECTRIC_QUERY_QUEUE)
                .build();
    }


    @Bean
    public Queue electricArrearsQueue() {
        return QueueBuilder.durable(ELECTRIC_NOTICE_QUEUE)
                .build();
    }


    @Bean
    public Binding bindQueryQueue(DirectExchange electricExchange, Queue electricQueryQueue) {
        return BindingBuilder.bind(electricQueryQueue).to(electricExchange).with(ELECTRIC_QUERY_ROUTING_KEY);
    }

    @Bean
    public Binding bindArrearsQueue(DirectExchange electricExchange, Queue electricArrearsQueue) {
        return BindingBuilder.bind(electricArrearsQueue).to(electricExchange).with(ELECTRIC_NOTICE_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }


}
