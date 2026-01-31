package com.dre4m1nd.ebap;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author dre4m1nd
 */
@EnableScheduling
@SpringBootApplication
@MapperScan("com.dre4m1nd.ebap.mapper")
public class EbapSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(EbapSystemApplication.class, args);
    }

}
