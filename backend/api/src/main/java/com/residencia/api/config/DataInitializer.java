package com.residencia.api.config;

import com.residencia.api.models.Rol;
import com.residencia.api.models.Usuario;
import com.residencia.api.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verificar si existe el usuario admin, si no, crearlo
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setEmail("admin@lupi.com");
            // Aquí definimos la contraseña plana, el encoder se encarga de hashearla
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Collections.singleton(Rol.ROLE_ADMIN));

            usuarioRepository.save(admin);
            System.out.println("------------------------------------------------");
            System.out.println(" USUARIO ADMIN CREADO: admin / admin123");
            System.out.println("------------------------------------------------");
        }

        // Verificar si existe el usuario comun, si no, crearlo
        if (!usuarioRepository.existsByUsername("user")) {
            Usuario user = new Usuario();
            user.setUsername("user");
            user.setEmail("user@lupi.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRoles(Collections.singleton(Rol.ROLE_USER));

            usuarioRepository.save(user);
            System.out.println("------------------------------------------------");
            System.out.println(" USUARIO COMUN CREADO: user / user123");
            System.out.println("------------------------------------------------");
        }
    }
}