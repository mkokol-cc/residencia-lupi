package com.residencia.api.controllers;

import com.residencia.api.dtos.JwtResponse;
import com.residencia.api.dtos.LoginRequest;
import com.residencia.api.models.Rol;
import com.residencia.api.models.Usuario;
import com.residencia.api.repositories.UsuarioRepository;
import com.residencia.api.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin("*")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
    
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt));
    
        } catch (Exception e) {
            return ResponseEntity
                .status(401)
                .body("Usuario o contraseña incorrectos");
        }
    }
    

    // Endpoint auxiliar para crear el primer usuario (eliminar o proteger después)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest signUpRequest) {
        if(usuarioRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username ya existe!");
        }

        Usuario user = new Usuario(signUpRequest.getUsername(),
                signUpRequest.getUsername() + "@test.com",
                passwordEncoder.encode(signUpRequest.getPassword()));

        user.setRoles(Collections.singleton(Rol.ROLE_ADMIN));
        usuarioRepository.save(user);
        return ResponseEntity.ok("Usuario registrado exitosamente!");
    }
}