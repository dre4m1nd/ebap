package com.dre4m1nd.ebap.aspect;

import cn.hutool.json.JSONUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

/**
 * @author dre4m1nd
 */
@Slf4j
@Aspect
@Component
public class LogAspect {

    @Pointcut("execution(* com.dre4m1nd.ebap.controller..*.*(..))" )
    public void pointCut() {
    }

    @Around("pointCut()")
    public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        // 请求信息
        log.info("请求URL:{},方法:{},参数:{}",
                request.getRequestURL(),
                request.getMethod(),
                Arrays.toString(joinPoint.getArgs()));
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        // 响应信息
        log.info("调用方法:{}.{}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName());
        log.info("响应耗时:{}ms, 结果:{}",
                System.currentTimeMillis() - startTime,
                JSONUtil.toJsonStr(result));
        return result;
    }

}
