package com.dre4m1nd.ebap.consumer;

import com.dre4m1nd.ebap.common.result.ElectricApiRequest;
import com.dre4m1nd.ebap.common.result.ElectricApiResponse;
import com.dre4m1nd.ebap.common.util.EmailTemplateUtil;
import com.dre4m1nd.ebap.config.RabbitMQConfig;
import com.dre4m1nd.ebap.pojo.entity.DormElectricLog;
import com.dre4m1nd.ebap.pojo.entity.DormEmailLog;
import com.dre4m1nd.ebap.pojo.entity.DormInfo;
import com.dre4m1nd.ebap.pojo.entity.DormStudent;
import com.dre4m1nd.ebap.service.IDormElectricLogService;
import com.dre4m1nd.ebap.service.IDormEmailLogService;
import com.dre4m1nd.ebap.service.IDormStudentService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * @author dre4m1nd
 * @since 2026/1/30
 */
@Component
@Slf4j
@AllArgsConstructor
public class RabbitMQListener {

    private EmailTemplateUtil emailTemplateUtil;
    private WebClient webClient;
    private RabbitTemplate rabbitTemplate;
    private IDormStudentService dormStudentService;
    private IDormElectricLogService dormElectricLogService;
    private IDormEmailLogService dormEmailLogService;

    public static final Integer TYPE_LIGHT = 1;
    public static final Integer TYPE_AIR = 2;

    @RabbitListener(queues = RabbitMQConfig.ELECTRIC_QUERY_QUEUE)
    public void queryListener(DormInfo dormInfo) {
        DormElectricLog lightElectricLog = query(dormInfo, TYPE_LIGHT);
        dormElectricLogService.save(lightElectricLog);
        DormElectricLog airElectricLog = query(dormInfo, TYPE_AIR);
        dormElectricLogService.save(airElectricLog);
        if (isArrearage(lightElectricLog, dormInfo, TYPE_LIGHT)) {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ELECTRIC_NOTICE_QUEUE,
                    lightElectricLog);
        }
        if (isArrearage(airElectricLog, dormInfo, TYPE_AIR)) {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ELECTRIC_NOTICE_QUEUE,
                    airElectricLog);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.ELECTRIC_NOTICE_QUEUE)
    public void noticeListener(DormElectricLog dormElectricLog) {
        List<DormStudent> students = dormStudentService.getByDormId(dormElectricLog.getDormId());
        students.forEach(dormStudent -> {
            try {
                emailTemplateUtil.sendEmail(dormStudent.getEmail(), toEmailParams(dormElectricLog, dormStudent));
                dormEmailLogService.save(toDormEmailLog(dormElectricLog, dormStudent));
            } catch (MessagingException e) {
                log.error("发送邮件失败：{}", e.getMessage());
                throw new RuntimeException(e);
            }
        });
        log.info("发送邮件成功");
    }



    private boolean isArrearage(DormElectricLog dormElectricLog, DormInfo dormInfo, Integer type) {
        return switch (type) {
            case 1 -> dormElectricLog.getLeftMoney() < dormInfo.getLimitLight();
            case 2 -> dormElectricLog.getLeftEle() < dormInfo.getLimitAir();
            default -> false;
        };
    }
    

    private DormElectricLog query(DormInfo dormInfo, Integer type) {
        ElectricApiRequest apiRequest = toApiRequest(dormInfo, type);
        ElectricApiResponse response = get(apiRequest);
        return toDormElectricLog(response, dormInfo, type);
    }


    private ElectricApiResponse get(ElectricApiRequest request) {
        // 前置校验：请求参数非空，避免拼接null参数导致接口异常
        if (request == null || request.getOpenId() == null || request.getType() == null) {
            log.error("调用电费接口失败：请求参数为空！request={}", request);
            throw new RuntimeException("调用电费接口失败：请求参数不能为空");
        }

        try {
            ElectricApiResponse response = webClient.get()
                    // 优化：使用pathSegment替代path，自动处理/拼接，避免//问题
                    .uri(uriBuilder -> uriBuilder
                            .pathSegment("getEleInfo") // 无需带/，自动和baseUrl拼接为 基础地址/getEleInfo
                            .queryParam("openId", request.getOpenId())
                            .queryParam("type", request.getType())
                            .build())
                    .retrieve()
                    // 优化1：异常日志添加【请求参数】，便于排查；用bodyToMono(String.class)获取真实响应体
                    .onStatus(status -> !status.is2xxSuccessful(), clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .flatMap(responseBody -> {
                                        log.error("调用电费接口失败，状态码：{}，请求参数：{}，响应体：{}",
                                                clientResponse.statusCode(), request, responseBody);
                                        return Mono.error(new RuntimeException(
                                                "GET调用校园电费接口失败，状态码：" + clientResponse.statusCode()));
                                    })
                    )
                    // 解析响应体（此时已配置日期规则，可正常解析LocalDateTime）
                    .bodyToMono(ElectricApiResponse.class)
                    .block();

            // 核心优化2：添加非空校验，避免返回null导致上层空指针
            if (response == null) {
                log.error("调用电费接口成功，但响应体解析为null！请求参数：{}", request);
                throw new RuntimeException("调用电费接口成功，未获取到有效响应数据");
            }

            // 可选优化：校验核心字段，增强鲁棒性
            if (response.getResultObject() == null) {
                log.warn("调用电费接口返回结果无数据！请求参数：{}，响应：{}", request, response);
                // 可根据业务选择：抛异常/返回原对象
                // throw new RuntimeException("调用电费接口返回结果为空");
            }

            return response;
        } catch (Exception e) {
            // 优化3：异常日志添加【请求参数】，定位问题更高效
            log.error("调用电费接口异常，请求参数：{}", request, e);
            throw new RuntimeException("调用电费接口异常：" + e.getMessage());
        }
    }

    private DormEmailLog toDormEmailLog(DormElectricLog dormElectricLog, DormStudent dormStudent) {
        return new DormEmailLog()
                .setDormId(dormElectricLog.getDormId())
                .setStudentId(dormStudent.getId());
    }

    private Map<String, Object> toEmailParams(DormElectricLog dormElectricLog, DormStudent dormStudent) {
        return Map.of(
                "nickName", dormStudent.getNickName(),
                "dormName", dormElectricLog.getDormId(),
                "leftMoney", dormElectricLog.getLeftMoney(),
                "leftEle", dormElectricLog.getLeftEle(),
                "queryTime", dormElectricLog.getQueryTime()
        );
    }

    private DormElectricLog toDormElectricLog(ElectricApiResponse response, DormInfo dormInfo, Integer type) {
        return new DormElectricLog()
                .setDormId(dormInfo.getId())
                .setMeterType(type)
                .setLeftMoney(Float.parseFloat(response.getResultObject().getLeftMoney()))
                .setLeftEle(Float.parseFloat(response.getResultObject().getLeftEle()))
                .setQueryTime(response.getResultObject().getMonTime());
    }

    private ElectricApiRequest toApiRequest(DormInfo dormInfo, Integer type) {
        return new ElectricApiRequest()
                .setOpenId(dormInfo.getOpenId())
                .setType(type);
    }

}
