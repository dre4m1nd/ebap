package com.dre4m1nd.ebap.common.result;

import lombok.Data;

@Data
public class Result<T> {

    private Integer code;

    private String message;

    private T data;


    public static <T> Result<T> success() {
        Result<T> result = new Result<T>();
        result.setCode(200);
        result.setMessage("操作成功!");
        return result;
    }

    public static <T> Result<T> success(String message) {
        Result<T> result = new Result<T>();
        result.setCode(200);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = success();
        result.setData(data);
        return result;
    }

    public static <T> Result<T> success(String message, T data) {
        Result<T> result = success(message);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> fail(Integer code, String message) {
        Result<T> result = new Result<T>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

}
