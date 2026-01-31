package com.dre4m1nd.ebap.common.result;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * @author dre4m1nd
 */
@Data
public class ElectricApiResponse {

    private String statusCode;

    private String message;

    private ResultObject resultObject;

    @Data
    public static class ResultObject {

        private String leftEle;

        private String loudong;

        private String leftMoney;

        private LocalDateTime monTime;

        private String room;
    }
}