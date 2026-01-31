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
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
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

    private final EmailTemplateUtil emailTemplateUtil;
    private final WebClient webClient;
    private final RabbitTemplate rabbitTemplate;
    private final IDormStudentService dormStudentService;
    private final IDormElectricLogService dormElectricLogService;
    private final IDormEmailLogService dormEmailLogService;

    // 建议：使用枚举或常量类
    public static final int TYPE_LIGHT = 1;
    public static final int TYPE_AIR = 2;

    @RabbitListener(queues = RabbitMQConfig.ELECTRIC_QUERY_QUEUE)
    public void queryListener(DormInfo dormInfo) {
        // 分别查询照明和空调
        processQuery(dormInfo, TYPE_LIGHT);
        processQuery(dormInfo, TYPE_AIR);
    }

    private void processQuery(DormInfo dormInfo, int type) {
        try {
            // 获取数据（block 是因为 RabbitListener 是同步的，但在 Mono 链内部处理逻辑）
            ElectricApiResponse response = fetchElectricData(dormInfo, type).block();

            if (response != null && response.getResultObject() != null) {
                DormElectricLog logEntity = toDormElectricLog(response, dormInfo, type);
                dormElectricLogService.save(logEntity);

                if (isArrearage(logEntity, dormInfo, type)) {
                    rabbitTemplate.convertAndSend(RabbitMQConfig.ELECTRIC_NOTICE_QUEUE, logEntity);
                }
            }
        } catch (Exception e) {
            log.error("处理宿管查询失败: dormId={}, type={}, error={}", dormInfo.getId(), type, e.getMessage());
        }
    }

    private Mono<ElectricApiResponse> fetchElectricData(DormInfo dormInfo, int type) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .pathSegment("getEleInfo")
                        .queryParam("openId", dormInfo.getOpenId())
                        .queryParam("type", type)
                        .build())
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("接口响应错误: " + body)))
                )
                .bodyToMono(ElectricApiResponse.class)
                .timeout(Duration.ofSeconds(12))
                .onErrorResume(e -> {
                    log.error("请求电费接口异常: {}", e.getMessage());
                    return Mono.empty();
                });
    }

    @RabbitListener(queues = RabbitMQConfig.ELECTRIC_NOTICE_QUEUE)
    public void noticeListener(DormElectricLog dormElectricLog) {
        List<DormStudent> students = dormStudentService.getByDormId(dormElectricLog.getDormId());
        for (DormStudent student : students) {
            try {
                emailTemplateUtil.sendEmail(student.getEmail(), toEmailParams(dormElectricLog, student));
                dormEmailLogService.save(toDormEmailLog(dormElectricLog, student));
                log.info("通知成功: 宿舍={} -> 学生={}", dormElectricLog.getDormId(), student.getNickName());
            } catch (Exception e) {
                log.error("邮件发送失败: {}", e.getMessage());
            }
        }
    }

    private boolean isArrearage(DormElectricLog log, DormInfo info, int type) {
        if (type == TYPE_LIGHT) {
            return log.getLeftMoney() < info.getLimitLight();
        }
        if (type == TYPE_AIR) {
            return log.getLeftEle() < info.getLimitAir();
        }
        return false;
    }

    private DormElectricLog toDormElectricLog(ElectricApiResponse response, DormInfo dormInfo, int type) {
        var obj = response.getResultObject();
        return new DormElectricLog()
                .setDormId(dormInfo.getId())
                .setMeterType(type)
                // 增加防御性解析，防止接口返回非数字字符串
                .setLeftMoney(safeParseFloat(obj.getLeftMoney()))
                .setLeftEle(safeParseFloat(obj.getLeftEle()))
                .setQueryTime(obj.getMonTime());
    }

    private float safeParseFloat(String value) {
        try {
            return value == null ? 0.0f : Float.parseFloat(value);
        } catch (NumberFormatException e) {
            return 0.0f;
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
