package com.hidro.manh.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Utilidad para generar hashes BCrypt de cualquier contraseña.
 * Se ejecuta una sola vez al levantar la app.
 */
@Component
public class PasswordGenerator implements CommandLineRunner {

    @Override
    public void run(String... args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPassword = "test"; // 👈 cámbiala por la clave que quieras
        String hash = encoder.encode(rawPassword);

        System.out.println("🔑 Generador de contraseñas ----------------------");
        System.out.println("Texto plano : " + rawPassword);
        System.out.println("Hash BCrypt : " + hash);
        System.out.println("-------------------------------------------------");
    }
}
