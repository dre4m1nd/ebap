package com.dre4m1nd.ebap.common.util;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;


/**
 * @author dre4m1nd
 */
@Component
@Slf4j
@AllArgsConstructor
public class RedisUtil {

    private StringRedisTemplate stringRedisTemplate;

    public Boolean tryLock(String key, String value, long expire) {
        try {
            return stringRedisTemplate.opsForValue().setIfAbsent(key, value, expire, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            log.error("tryLock error", e);
            return false;
        }
    }

}
