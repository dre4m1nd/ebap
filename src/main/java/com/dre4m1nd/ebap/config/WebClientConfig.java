package com.dre4m1nd.ebap.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author dre4m1nd
 */
@Slf4j
@Configuration
public class WebClientConfig {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Bean
    public WebClient webClient() {
        // 1. 定义时间格式
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 2. 创建并配置 Jackson 模块
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        // 序列化：LocalDateTime -> String
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));
        // 反序列化：String -> LocalDateTime （这是解决报错的关键！）
        javaTimeModule.addDeserializer(LocalDateTime.class, new com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer(formatter));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(javaTimeModule);
        // 忽略接口中多余的字段，增强稳定性
        objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 3. 显式创建 Decoder/Encoder
        Jackson2JsonDecoder decoder = new Jackson2JsonDecoder(objectMapper);
        Jackson2JsonEncoder encoder = new Jackson2JsonEncoder(objectMapper);

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .responseTimeout(Duration.ofSeconds(10));

        return WebClient.builder()
                .codecs(config -> {
                    config.defaultCodecs().jackson2JsonDecoder(decoder);
                    config.defaultCodecs().jackson2JsonEncoder(encoder);
                })
                .baseUrl("https://sdxt.hainanu.edu.cn/scanQRWaterCtrl_redis_hndx1/service/weixinEle")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .filter((request, next) -> {
                    return next.exchange(request).flatMap(response ->
                            response.bodyToMono(String.class)
                                    .defaultIfEmpty("")
                                    .map(body -> {
                                        log.info("【响应】{} -> {}", request.url().getPath(), body);
                                        return response.mutate().body(body).build();
                                    })
                    );
                })
                .build();
    }
}