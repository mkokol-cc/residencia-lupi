package com.residencia.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Residencia Lupi API",
        version = "1.0",
        description = "Documentación de la API para la gestión de la residencia"
    )
)
public class OpenApiConfig {
}