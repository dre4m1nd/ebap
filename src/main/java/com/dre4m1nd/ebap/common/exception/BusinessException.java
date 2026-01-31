package com.dre4m1nd.ebap.common.exception;

/**
 * @author dre4m1nd
 */
public class BusinessException extends RuntimeException {

    public BusinessException() {
        super("业务异常");
    }

    public BusinessException(String message) {
        super(message);
    }

}
