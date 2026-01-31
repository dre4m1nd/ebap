package com.dre4m1nd.ebap.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.cbor.Jackson2CborDecoder;
import org.springframework.http.codec.cbor.Jackson2CborEncoder;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.scheduler.Schedulers;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author dre4m1nd
 * @since 2026/1/30
 * 适配微信小程序环境的WebClient配置（核心：模拟微信请求头、稳定的超时配置）
 */
@Slf4j
@Configuration
public class WebClientConfig {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Bean
    public WebClient webClient() {

        ObjectMapper objectMapper = new ObjectMapper();
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(FORMATTER));
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(FORMATTER));
        objectMapper.registerModule(javaTimeModule);



        // 1. 配置HttpClient：超时+长连接（适配微信接口）
        HttpClient httpClient = HttpClient.create()
                // 连接超时：5秒（避免卡慢）
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                // 响应超时：10秒（微信接口可能略慢，放宽超时）
                .responseTimeout(Duration.ofMillis(10000))
                // 长连接保持：适配keep-alive
                .keepAlive(true);

        // 2. 构建WebClient：基础地址+微信核心请求头+默认配置
        return WebClient.builder()
                .codecs(config -> {
                    config.defaultCodecs().jackson2JsonEncoder(new Jackson2CborEncoder(objectMapper));
                    config.defaultCodecs().jackson2JsonDecoder(new Jackson2CborDecoder(objectMapper));
                })
                // 基础地址（仅域名+接口前缀，避免URL拼接冗余）
                .baseUrl("https://sdxt.hainanu.edu.cn/scanQRWaterCtrl_redis_hndx1/service/weixinEle")
                // 绑定HttpClient配置（超时/长连接）
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                // ========== 日志拦截器：仅打印核心信息 + 响应体 ==========
                .filter((request, next) -> {
                    String requestUrl = request.url().toString();
                    log.info("【请求】方法：{}，URL：{}", request.method(), requestUrl);

                    // 执行请求并仅打印响应状态码 + 响应体
                    return next.exchange(request)
                            .publishOn(Schedulers.boundedElastic())
                            .doOnNext(response -> {
                                log.info("【响应】URL：{}，状态码：{}", requestUrl, response.statusCode());
                                // 仅打印响应体（异步读取）
                                response.bodyToMono(String.class)
                                        .subscribe(
                                                responseBody -> log.info("【响应体】{}", responseBody),
                                                error -> log.error("【响应体读取失败】URL：{}，异常：{}", requestUrl, error.getMessage())
                                        );
                            })
                            // 响应异常日志（仅打印核心信息）
                            .doOnError(error -> log.error("【请求失败】URL：{}，异常：{}", requestUrl, error.getMessage()));
                })
                .build();
    }
}