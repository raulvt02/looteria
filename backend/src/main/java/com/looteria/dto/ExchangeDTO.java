package com.looteria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExchangeDTO {
    private Long idIntercambio;
    private Long publicacionId;
    private String publicacionTitulo;
    private String publicacionImagen;
    private Long solicitanteId;
    private String solicitanteNombre;
    private Long solicitadoId;
    private String solicitadoNombre;
    private String mensaje;
    private String estado;
    private boolean completadoPorSolicitante;
    private boolean completadoPorSolicitado;
    private String fechaCreacion;
}
