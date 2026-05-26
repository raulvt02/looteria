package com.looteria.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationCode(String toEmail, String nombreUsuario, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Código de verificación - Looteria");
        message.setText(String.format(
            "Hola %s,\n\n" +
            "Tu código de verificación para Looteria es: %s\n\n" +
            "Este código expirará en 30 minutos.\n\n" +
            "Si no solicitaste este código, ignora este email.\n\n" +
            "Saludos,\n" +
            "Equipo Looteria",
            nombreUsuario, codigo
        ));
        
        mailSender.send(message);
    }
}
