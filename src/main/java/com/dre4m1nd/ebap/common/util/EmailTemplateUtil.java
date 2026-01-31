package com.dre4m1nd.ebap.common.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Locale;
import java.util.Map;

/**
 * @author dre4m1nd
 * @since 2026/1/31
 */
@Component
@Slf4j
@AllArgsConstructor
public class EmailTemplateUtil {

    private JavaMailSender javaMailSender;
    private TemplateEngine templateEngine;

    private final static String TEMPLATE_NAME = "notice_mail";

    public void sendEmail(String toEmail, Map<String, Object> params) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom("ebap@dre4m1nd.com");
        helper.setTo(toEmail);
        helper.setSubject("电费提醒");

        Context context = new Context(Locale.CHINA, params);
        String process = templateEngine.process(TEMPLATE_NAME, context);

        helper.setText(process, true);
        javaMailSender.send(mimeMessage);
    }





}
