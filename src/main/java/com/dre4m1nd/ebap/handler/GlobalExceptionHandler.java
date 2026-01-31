package com.dre4m1nd.ebap.handler;

import cn.hutool.core.util.StrUtil;
import com.dre4m1nd.ebap.common.exception.BusinessException;
import com.dre4m1nd.ebap.common.exception.ForbiddenException;
import com.dre4m1nd.ebap.common.exception.UnAuthorizedException;
import com.dre4m1nd.ebap.common.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;

/**
 * @author dre4m1nd
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.error("业务异常:{}", e.getMessage());
        return Result.fail(HttpStatus.BAD_REQUEST.value(), e.getMessage());
    }

    /**
     * 处理未授权异常（401 Unauthorized）
     */
    @ExceptionHandler(UnAuthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result<Void> handleUnAuthorizedException(UnAuthorizedException e) {
        log.warn("未授权访问:{}", e.getMessage());
        return Result.fail(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
    }

    /**
     * 处理权限禁止异常（403 Forbidden）
     */
    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Result<Void> handleForbiddenException(ForbiddenException e) {
        log.warn("权限禁止:{}", e.getMessage());
        return Result.fail(HttpStatus.FORBIDDEN.value(), e.getMessage());
    }

    @ExceptionHandler(SQLException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleSqlException(SQLException e) {
        log.error("数据库异常", e);
        String message = StrUtil.isNotBlank(e.getMessage()) ? e.getMessage() : "数据库异常!";
        return Result.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), message);
    }

    /**
     * 处理所有未捕获的通用异常（500 Internal Server Error）
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        String message = StrUtil.isNotBlank(e.getMessage()) ? e.getMessage() : "服务器内部错误!";
        return Result.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), message);
    }
}