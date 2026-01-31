package com.dre4m1nd.ebap.common.exception;

/**
 * @author dre4m1nd
 */
public class UnAuthorizedException extends RuntimeException{
    public UnAuthorizedException() {
        super("暂未登录或token已经过期!");
    }

    public UnAuthorizedException(String message) {
        super(message);
    }

}
