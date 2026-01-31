package com.dre4m1nd.ebap.common.exception;

/**
 * @author dre4m1nd
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException() {
        super("没有权限!");
    }

    public ForbiddenException(String message) {
        super(message);
    }

}
