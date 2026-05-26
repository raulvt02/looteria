package com.looteria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class AdminUserUpdateDTO {
    private String email;
    private String nombreUsuario;
    private String rol;
    private String ubicacion;
    private BigDecimal reputacionMedia;
    private Boolean verificadoIdentidad;
}