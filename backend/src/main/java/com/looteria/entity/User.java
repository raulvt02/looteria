package com.looteria.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false, unique = true)
    private String nombreUsuario;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole rol;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "ubicacion")
    private String ubicacion;

    @Column(name = "puntos_acumulados", nullable = false)
    private Long puntosAcumulados = 0L;

    @Column(name = "verificado_identidad", nullable = false)
    private Boolean verificadoIdentidad = false;

    @Column(name = "reputacion_media", nullable = false, precision = 3, scale = 2)
    private BigDecimal reputacionMedia = BigDecimal.ZERO;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
}
